# -*- coding: utf-8 -*-
import numpy as np
import librosa
from scipy import signal
from math import sqrt
from scipy import stats

##############################################################################################################
### Funções do código ########################################################################################
##############################################################################################################

# In[]:
def gini(values):
    """
    Compute the Gini index of values.

    values: a list of values

    Inspired by http://mathworld.wolfram.com/GiniCoefficient.html and http://en.wikipedia.org/wiki/Gini_coefficient
    """
    y = sorted(values)
    n = len(y)
    G = np.sum([i*j for i,j in zip(y,range(1,n+1))])
    G = 2 * G / np.sum(y) - (n+1)
    return G/n

# In[]:
def pcm2float(sig, dtype='float64'):
    """Convert PCM signal to floating point with a range from -1 to 1.

    Use dtype='float32' for single precision.

    Parameters
    ----------
    sig : array_like
        Input array, must have integral type.
    dtype : data type, optional
        Desired (floating point) data type.

    Returns
    -------
    numpy.ndarray
        Normalized floating point data.

    See Also
    --------
    float2pcm, dtype

    """
    sig = np.asarray(sig)
    if sig.dtype.kind not in 'iu':
        raise TypeError("'sig' must be an array of integers")
    dtype = np.dtype(dtype)
    if dtype.kind != 'f':
        raise TypeError("'dtype' must be a floating point type")

    i = np.iinfo(sig.dtype)
    abs_max = 2 ** (i.bits - 1)
    offset = i.min + abs_max
    return (sig.astype(dtype) - offset) / abs_max      

# In[]:
def compute_ACI(sample, rate, timeWindow, min_freq, max_freq, j_bin = 5, fft_w = 512, db_threshold=50):
    """
    Compute Acoustic Evenness Index of an audio signal.

    Reference: Villanueva-Rivera, L. J., B. C. Pijanowski, J. Doucette, and B. Pekin. 2011. A primer of acoustic analysis for landscape ecologists. Landscape Ecology 26: 1233-1246.

    spectro: spectrogram of the audio signal
    freq_band_Hz: frequency band size of one bin of the spectrogram (in Hertz)
    max_freq: the maximum frequency to consider to compute AEI (in Hertz)
    db_threshold: the minimum dB value to consider for the bins of the spectrogram
    freq_step: size of frequency bands to compute AEI (in Hertz)

    Ported from the soundecology R package.
    """
    
    bandSize = (rate/2)/(fft_w/2)
    min_freqi = min_freq/bandSize
    max_freqi = max_freq/bandSize
    if max_freqi > (fft_w/2):
        max_freqi = fft_w/2

    j_bin = j_bin+1

    spectro = sample[min_freqi:max_freqi,:]

    # alternative time indices to follow the R code
    times = range(0, spectro.shape[1]-10, j_bin)

    # sub-spectros of temporal size j        
    jspecs = [np.array(spectro[:,j:j+j_bin]) for j in times]

    # list of ACI values on each jspecs
    aci = [np.sum((np.sum(abs(np.diff(jspecs[k])), axis=1) / np.sum(jspecs[k], axis=1))) for k in range(len(jspecs))]

    result = np.sum(aci)

    return result

#resACI = compute_ACI(
#            selChannel,
#            rate=rate,
#            timeWindow=5,
#            min_freq=0, 
#            max_freq=8000, 
#            j_bin=1, 
#            fft_w=512, 
#            db_threshold=50)

# In[]:  
def compute_ADI(sample, rate, timeWindow, max_freq=10000, freq_step=1000, fft_w = 512, db_threshold=50):
    """
    Compute Acoustic Diversity Index.

    Reference: Villanueva-Rivera, L. J., B. C. Pijanowski, J. Doucette, and B. Pekin. 2011. A primer of acoustic analysis for landscape ecologists. Landscape Ecology 26: 1233-1246.

    spectro: spectrogram of the audio signal
    freq_band_Hz: frequency band size of one bin of the spectrogram (in Hertz)
    max_freq: the maximum frequency to consider to compute ADI (in Hertz)
    db_threshold: the minimum dB value to consider for the bins of the spectrogram
    freq_step: size of frequency bands to compute ADI (in Hertz)


    Ported from the soundecology R package.
    """
    
    #freq_band_Hz = (max_freq / freq_step)
    
    bandSize = (rate/2)/(fft_w/2)
    max_freqi = (max_freq/bandSize)
    freq_stepi = freq_step/bandSize
    if max_freqi > (fft_w/2):
        max_freqi = (fft_w/2)+1
    
    bands_Hz = range(0, max_freqi, freq_stepi)
    #bands_bin = [f / freq_band_Hz for f in bands_Hz]
    
    spec_ADI = sample[0:max_freqi,:]
    
    spec_ADI_bands = [spec_ADI[bands_Hz[k]:bands_Hz[k+1],] for k in range(len(bands_Hz)-1)]
    
    values = [np.sum(spec_ADI_bands[k]>-db_threshold)/float(spec_ADI_bands[k].size) for k in range(len(bands_Hz)-1)]    
    values = [value for value in values if value != 0]        
    
    result = np.sum([-j/ np.sum(values) * np.log(j / np.sum(values)) for j in values])    

    return result    

#max_freq=8000
#freq_step=1000
#freq_band_Hz=(max_freq / freq_step)
#fft_w = rate / freq_band_Hz
#
#resADI = compute_ADI(
#            selChannel, 
#            rate=rate,
#            timeWindow=5,
#            freq_band_Hz=freq_band_Hz,
#            max_freq=max_freq, 
#            freq_step=freq_step, 
#            fft_w=fft_w, 
#            db_threshold=50)

# In[]:
def compute_AEI(sample, rate, timeWindow, max_freq=10000, freq_step=1000, db_threshold=50, fft_w = 512):
    """
    Compute Acoustic Evenness Index of an audio signal.

    Reference: Villanueva-Rivera, L. J., B. C. Pijanowski, J. Doucette, and B. Pekin. 2011. A primer of acoustic analysis for landscape ecologists. Landscape Ecology 26: 1233-1246.

    spectro: spectrogram of the audio signal
    freq_band_Hz: frequency band size of one bin of the spectrogram (in Hertz)
    max_freq: the maximum frequency to consider to compute AEI (in Hertz)
    db_threshold: the minimum dB value to consider for the bins of the spectrogram
    freq_step: size of frequency bands to compute AEI (in Hertz)

    Ported from the soundecology R package.
    """
    
    #freq_band_Hz = (max_freq / freq_step)  
    
    bandSize = (rate/2)/(fft_w/2)
    max_freqi = max_freq/bandSize
    freq_stepi = freq_step/bandSize
    if max_freqi > (fft_w/2):
        max_freqi = (fft_w/2)+1
    
    bands_Hz = range(0, max_freqi, freq_stepi)
    #bands_bin = [f / freq_band_Hz for f in bands_Hz]
    
    spectro = sample[0:max_freqi,:]
    
    spec_AEI = spectro
    spec_AEI_bands = [spec_AEI[bands_Hz[k]:bands_Hz[k]+bands_Hz[1],] for k in range(len(bands_Hz)-1)]
    
    values = [np.sum(spec_AEI_bands[k]>-db_threshold)/float(spec_AEI_bands[k].size) for k in range(len(bands_Hz)-1)]
    result = gini(values)

    return result

#max_freq=8000
#freq_step=1000
#freq_band_Hz=(max_freq / freq_step)
#fft_w = rate / freq_band_Hz
#resAEI = compute_AEI(
#            selChannel, 
#            rate=rate,
#            timeWindow=5,
#            max_freq=max_freq, 
#            freq_step=freq_step, 
#            fft_w=fft_w,
#            db_threshold=50)
            
# In[]:
def compute_BIO(sample, rate, timeWindow, min_freq = 2000, max_freq = 8000, fft_w=512, db_threshold=50):
    """
    Compute the Bioacoustic Index from the spectrogram of an audio signal.
    In this code, the Bioacoustic Index correspond to the area under the mean spectre (in dB) minus the minimum frequency value of this mean spectre.

    Reference: Boelman NT, Asner GP, Hart PJ, Martin RE. 2007. Multi-trophic invasion resistance in Hawaii: bioacoustics, field surveys, and airborne remote sensing. Ecological Applications 17: 2137-2144.

    spectro: the spectrogram of the audio signal
    min_freq: minimum frequency (in Hertz)
    max_freq: maximum frequency (in Hertz)

    Ported from the soundecology R package.
    """
    
    # list of the frequencies of the spectrogram
    frequencies = librosa.fft_frequencies(rate, fft_w)

    #freq_band_Hz=(max_freq / freq_step)    

    bandSize = (rate/2)/(fft_w/2)
    min_freqi = min_freq/bandSize
    max_freqi = max_freq/bandSize
    if max_freqi > (fft_w/2):
        max_freqi = fft_w/2

    spectro = sample[min_freqi:max_freqi,:]
    
    # min freq in samples (or bin)
    min_freq_bin=np.argmin([abs(e - min_freq) for e in frequencies])
    max_freq_bin= int(np.ceil(np.argmin([abs(e - max_freq) for e in frequencies]))) # max freq in samples (or bin)

    min_freq_bin = min_freq_bin - 1 # alternative value to follow the R code
    
    # Use of decibel values. Equivalent in the R code to: spec_left <- spectro(left, f = samplingrate, wl = fft_w, plot = FALSE, dB = "max0")$amp
    #spectro_BI = 20 * np.log10(spectro/np.max(spectro))  
    spectro_BI = spectro

    # Compute the mean for each frequency (the output is a spectre). This is not exactly the mean, but it is equivalent to the R code to: return(a*log10(mean(10^(x/a))))        
    spectre_BI_mean = 10 * np.log10 (np.mean(10 ** (spectro_BI/10), axis=1))

    # Segment between min_freq and max_freq
    spectre_BI_mean_segment =  spectre_BI_mean[min_freq_bin:max_freq_bin]
    
    # Normalization: set the minimum value of the frequencies to zero.
    spectre_BI_mean_segment_normalized = spectre_BI_mean_segment - min(spectre_BI_mean_segment)
    
    # Compute the area under the spectre curve. Equivalent in the R code to: left_area <- sum(specA_left_segment_normalized * rows_width)
    area = np.sum(spectre_BI_mean_segment_normalized / (frequencies[1]-frequencies[0]))
    
    result = area

    return result

#resBIO = compute_BIO(
#            selChannel, 
#            rate=rate,
#            timeWindow=5,
#            min_freq = 2000, 
#            max_freq = 8000, 
#            fft_w=512,
#            db_threshold=50)    

# In[]:
def compute_MFCC(soundMono, rate, timeWindow=1, numcep=12, min_freq=0, max_freq=8000, useMel=False):
    
    sample  = soundMono

    if useMel:
        melSpec = librosa.feature.melspectrogram(y=sample, sr=rate, n_mels=numcep, fmin=min_freq, fmax=max_freq)    
        mfccs = librosa.feature.mfcc(S=librosa.power_to_db(melSpec), sr=rate, n_mfcc=numcep)
    else:    
        mfccs = librosa.feature.mfcc(y=sample, sr=rate, n_mfcc=numcep)
    
    result = np.mean(mfccs, axis=1)

    return result

#resMFCC = compute_MFCC(soundMono=selChannel, rate=rate, timeWindow=5, numcep=12, minfreq=0, maxfreq=rate, useMel=False)

# In[]:
def compute_NDSI(soundMono, rate, timeWindow, fft_w=512, anthrophony=[1000,2000], biophony=[2000,11000]):
    """
    Compute Normalized Difference Sound Index from an audio signal.
    This function compute an estimate power spectral density using Welch's method.

    Reference: Kasten, Eric P., Stuart H. Gage, Jordan Fox, and Wooyeong Joo. 2012. The Remote Environ- mental Assessment Laboratory's Acoustic Library: An Archive for Studying Soundscape Ecology. Ecological Informatics 12: 50-67.

    windowLength: the length of the window for the Welch's method.
    anthrophony: list of two values containing the minimum and maximum frequencies (in Hertz) for antrophony.
    biophony: list of two values containing the minimum and maximum frequencies (in Hertz) for biophony.

    Inspired by the seewave R package, the soundecology R package and the original matlab code from the authors.
    """
    
    sample  = soundMono

    frequencies, pxx = signal.welch(
        sample, #pcm2float(sample,dtype='float64'), 
        fs=rate, 
        window='hamming', 
        nperseg=fft_w, 
        noverlap=fft_w/2, 
        nfft=fft_w, 
        detrend='constant', 
        return_onesided=True, 
        scaling='density', 
        axis=-1) # Estimate power spectral density using Welch's method
    avgpow = pxx * frequencies[1] # use a rectangle approximation of the integral of the signal's power spectral density (PSD)
    #avgpow = avgpow / np.linalg.norm(avgpow, ord=2) # Normalization (doesn't change the NDSI values. Slightly differ from the matlab code).

    min_anthro_bin=np.argmin([abs(e - anthrophony[0]) for e in frequencies])  # min freq of anthrophony in samples (or bin) (closest bin)
    max_anthro_bin=np.argmin([abs(e - anthrophony[1]) for e in frequencies])  # max freq of anthrophony in samples (or bin)
    min_bio_bin=np.argmin([abs(e - biophony[0]) for e in frequencies])  # min freq of biophony in samples (or bin)
    max_bio_bin=np.argmin([abs(e - biophony[1]) for e in frequencies])  # max freq of biophony in samples (or bin)

    anthro = np.sum(avgpow[min_anthro_bin:max_anthro_bin])
    bio = np.sum(avgpow[min_bio_bin:max_bio_bin])

    ndsi = (bio - anthro) / (bio + anthro)

    return ndsi, anthro, bio

#resNDSI, resNDSI_Anthro, resNDSI_Bio = compute_NDSI(
#            selChannel, 
#            rate=rate,
#            timeWindow=5,
#            fft_w=512,
#            anthrophony=[1000,2000], 
#            biophony=[2000,11000])

# In[]:
def compute_RMS_Energy(soundMono, rate, timeWindow):
    """
    Compute the RMS short time energy.

    file: an instance of the AudioFile class.
    windowLength: size of the sliding window (samples)
    windowHop: size of the lag window (samples)
    integer: if set as True, the Temporal Entropy will be compute on the Integer values of the signal. If not, the signal will be set between -1 and 1.

    return: a list of values (rms energy for each window)
    """

    sample = soundMono
    
    result = librosa.feature.rmse(S=sample)
            
    return result

#resRMS = compute_RMS_Energy(selChannel, rate=rate, timeWindow=5)

# In[]:
def compute_TH(soundMono, rate, timeWindow):
    """
    Compute Temporal Entropy of Shannon from an audio signal.

    file: an instance of the AudioFile class.
    integer: if set as True, the Temporal Entropy will be compute on the Integer values of the signal. If not, the signal will be set between -1 and 1.

    Ported from the seewave R package.
    """

    sample = soundMono
    
    env = abs(signal.hilbert(sample)) # Modulo of the Hilbert Envelope

    env = env / np.sum(env)  # Normalization
    N = len(env)
    result = -sum([y * np.log2(y) for y in env]) / np.log2(N)

    return result

#resTH = compute_TH(selChannel, rate=rate, timeWindow=5)

# In[]:
def compute_ZCR(soundMono, rate, timeWindow):
    """
    Compute the Zero Crossing Rate of an audio signal.

    file: an instance of the AudioFile class.
    windowLength: size of the sliding window (samples)
    windowHop: size of the lag window (samples)

    return: a list of values (number of zero crossing for each window)
    """
    
    sample = soundMono

    result = np.mean(librosa.feature.zero_crossing_rate(sample))
    
    return result

#resZCR = compute_ZCR(selChannel, rate=rate, timeWindow=5)

# In[]:
#SpecMean                  
def compute_SpecProp_Mean(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]
    
    # #FFT's means
    mn_ffts = np.mean(spectro, axis=1)

    # Mean
    mn_spec = np.mean(mn_ffts, axis=0)
    
    return mn_spec

#t0 = time.time()
#resSpecPropMean = compute_SpecProp_Mean(selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50)
#print("Time Spec Mean for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Mean for 600 seconds: 6.62701392174

# In[]:
#SpecSD
def compute_SpecProp_SD(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2
    
    spectro = sample[min_freqi:max_freqi, :]
    
    # #FFT's means'
    mn_ffts = np.mean(spectro, axis=1)

    # Mean
    std_spec = np.std(mn_ffts)
    
    return std_spec

#t0 = time.time()
#resSpecPropSD = compute_SpecProp_SD(selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50)
#print("Time Spec SD for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec SD for 600 seconds: 6.86261796951

# In[]:
# SpecSEM - Standard Error of the Mean
def compute_SpecProp_SEM(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]

    mn_ffts = np.mean(spectro, axis=1)

    std_spec = np.std(mn_ffts)

    # Sem: standard error of the mean. *
    sqt_L = np.sqrt(np.shape(spectro)[0])
    sem_spec = std_spec/sqt_L

    return sem_spec

#t0 = time.time()
#resSpecPropSEM = compute_SpecProp_SEM(selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50)
#print("Time Spec SEM for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec SEM for 600 seconds: 6.82167506218

# In[]:
#SpecMedian
def compute_SpecProp_Median(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50):
    
    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]

    mn_ffts = np.mean(spectro, axis=1)

    # Median
    mdn_spec = np.median(mn_ffts, axis=0)
    
    return mdn_spec

#t0 = time.time()
#resSpecPropMedian = compute_SpecProp_Median(selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50)
#print("Time Spec Median for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Median for 600 seconds: 6.82771015167

# In[]:
# SpecMode
def compute_SpecProp_Mode(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50):
    
    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]

    mn_ffts = np.mean(spectro, axis=1)

    mod_spec = stats.mode(mn_ffts, axis=0)[0][0]        
    
    return mod_spec

#t0 = time.time()
#resSpecPropMode = compute_SpecProp_Mode(selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50)
#print("Time Spec Mode for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Mode for 600 seconds: 7.93447113037

# In[]:
#SpecQuartiles
def compute_SpecProp_Quartiles(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2    

    spectro = sample[min_freqi:max_freqi, :]

    mn_ffts = np.mean(spectro, axis=1)

    q25_spec = np.percentile(mn_ffts, 25, axis=0)
    q50_spec = np.percentile(mn_ffts, 50, axis=0)
    q75_spec = np.percentile(mn_ffts, 75, axis=0)    
    IQR_spec = q75_spec - q25_spec
        
    return q25_spec, q50_spec, q75_spec, IQR_spec

#t0 = time.time()
#resSpecPropQ25, resSpecPropQ50, resSpecPropQ75, resSpecPropIQR = compute_SpecProp_Quartiles(
#    selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50)
#print("Time Spec Quartiles for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Quartiles for 600 seconds: 6.78992795944

# In[]:
#SpecSkewness
def compute_SpecProp_Skewness(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50, power=True):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]

    mn_ffts = np.mean(spectro, axis=1)

    skw_spec = np.mean( [stats.skew(abs(mn_ffts))] )
    
    return skw_spec

#t0 = time.time()
#resSpecPropSkewness = compute_SpecProp_Skewness(
#    selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=2048, db_threshold=50, power=True)
#print("Time Spec Skewness for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Skewness for 600 seconds: 6.86085009575

# In[]:
#SpecKurtosis
def compute_SpecProp_Kurtosis(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50, power=True):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]    

    mn_ffts = np.mean(spectro, axis=1)

    kts_spec = np.mean(stats.kurtosis(mn_ffts))
    
    return kts_spec

#t0 = time.time()
#resSpecPropKurtosis = compute_SpecProp_Kurtosis(
#    selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50, power=True)
#print("Time Spec Kurtosis for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Kurtosis for 600 seconds: 6.95281100273

# In[]:
#SpecEntropy
def compute_SpecProp_Entropy(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50, power=True):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]    

    mn_ffts = np.mean(spectro, axis=1)

    etp_spec = stats.entropy(mn_ffts)
    
    return etp_spec

#t0 = time.time()
#resSpecPropEntropy = compute_SpecProp_Entropy(
#    selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50, power=True)
#print("Time Spec Entropy for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Entropy for 600 seconds: 6.78252196312

# In[]:
#SpecVariance
def compute_SpecProp_Variance(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50, power=True):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]

    mn_ffts = np.mean(spectro, axis=1)

    result = np.var(abs(mn_ffts))
    
    return result

#t0 = time.time()
#resSpecPropVariance = compute_SpecProp_Variance(
#    selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50, power=True)
#print("Time Spec Variance for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Variance for 600 seconds: 6.85573792458

# In[]:
#SpecChromaSTFT
def compute_SpecProp_Chroma_STFT(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50, power=True):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]
    
    result = np.mean(np.abs(librosa.feature.chroma_stft(sr=rate, S=spectro)))
    
    return result

#t0 = time.time()
#resSpecChromaSTFT = compute_SpecProp_Chroma_STFT(
#    selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50, power=True)
#print("Time Spec Chroma STFT for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Chroma STFT for 600 seconds: 9.45146179199

# In[]:
#SpecChromaCQT
def compute_SpecProp_Chroma_CQT(soundMono, rate, timeWindow):

    sample  = np.array( soundMono ).astype(np.float)

    result = np.mean(np.abs(librosa.feature.chroma_cqt(y=sample, sr=rate)))
    
    return result

#t0 = time.time()
#resSpecChromaCQT = compute_SpecProp_Chroma_CQT(selChannel, rate=rate, timeWindow=5)
#print("Time Spec Chroma CQT for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Chroma CQT for 600 seconds: 16.6677119732

# In[]:
#SpecCentroid
def compute_SpecProp_Centroid(soundMono, rate, timeWindow, fft_w=512):

    sample  = np.array( soundMono ).astype(np.float)

    result = np.mean(librosa.feature.spectral_centroid(y=sample, sr=rate, n_fft=fft_w))
    
    return result

#t0 = time.time()
#resSpecCentroid = compute_SpecProp_Centroid(selChannel, rate=rate, timeWindow=5, fft_w=512)
#print("Time Spec Centroid for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Centroid for 600 seconds: 0.612009048462

# In[]:
#SpecBandwidth
def compute_SpecProp_Bandwidth(soundMono, rate, timeWindow, fft_w=512):
    
    sample  = np.array( soundMono ).astype(np.float)

    result = np.mean(librosa.feature.spectral_bandwidth(y=sample, sr=rate, n_fft=fft_w))
    
    return result

#t0 = time.time()
#resSpecBandwidth = compute_SpecProp_Bandwidth(selChannel, rate=rate, timeWindow=5, fft_w=512)
#print("Time Spec Bandwidth for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Bandwidth for 600 seconds: 0.901921033859

# In[]:
#SpecContrast
def compute_SpecProp_Contrast(soundMono, rate, timeWindow, fft_w=512):

    sample  = np.array( soundMono ).astype(np.float)

    result = np.mean(librosa.feature.spectral_contrast(sr=rate, y=np.abs(sample), n_fft=fft_w))
    
    return result

#t0 = time.time()
#resSpecContrast = compute_SpecProp_Contrast(selChannel, rate=rate, timeWindow=5, fft_w=512)
#print("Time Spec Contrast for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Contrast for 600 seconds: 1.25812196732

# In[]:
#SpecRolloff
def compute_SpecProp_Rolloff(soundMono, rate, timeWindow, fft_w=512):
    
    sample  = np.array( soundMono ).astype(np.float)

    result = np.mean(librosa.feature.spectral_rolloff(y=sample, sr=rate))
    
    return result

#t0 = time.time()
#resSpecRolloff = compute_SpecProp_Rolloff(selChannel, rate=rate, timeWindow=5, fft_w=512)
#print("Time Spec Rolloff for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Rolloff for 600 seconds: 2.21312117577


# In[]:
#SpecPolyFeat
def compute_SpecProp_PolyFeatures(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50, power=True):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2    

    spectro = sample[min_freqi:max_freqi, :]

    result_zero = np.mean( librosa.feature.poly_features(S=np.abs(spectro), order=0, n_fft=fft_w) )

    # Poly_features_linear
    result_linear = np.mean(librosa.feature.poly_features(S=np.abs(spectro), order=1, n_fft=fft_w))

    # Poly_features_quadratic
    result_quadratic = np.mean(librosa.feature.poly_features(S=np.abs(spectro), order=2, n_fft=fft_w))
    
    return result_zero, result_linear, result_quadratic

#t0 = time.time()
#resSpecPolyFeatures_Zero, resSpecPolyFeatures_Linear, resSpecPolyFeatures_Quadratic = compute_SpecProp_PolyFeatures(
#    selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50, power=True)
#print("Time Spec Poly Features for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time Spec Poly Features for 600 seconds: 8.98274302483

# In[]:
def compute_SpecSpread(soundMono, sample, rate, timeWindow, fft_w=512, db_threshold=50):    
    """
    Compute the spectral spread (basically a variance of the spectrum around the spectral centroid)
    """
    
    centroid = np.mean(librosa.feature.spectral_centroid(y=soundMono, sr=rate))
            
    spectro = sample
    
    binNumber = 0
    numerator = 0
    denominator = 0
    
    for bin in spectro:
        # Compute center frequency
        f = (rate / 2.0) / len(spectro)
        f = f * binNumber
    
        numerator = numerator + (((f - centroid) ** 2) * abs(bin))
        denominator = denominator + abs(bin)
    
        binNumber = binNumber + 1
    
    result = sqrt(np.mean(numerator * 1.0) / np.mean(denominator))

    return result

#resSpread = compute_SpecSpread(selChannel, rate=rate, timeWindow=5, fft_w=512, db_threshold=50)
    
# In[]:
#SPL
def compute_SPL(sample, rate, timeWindow, min_freq, max_freq, fft_w=512, db_threshold=50):

    #Max and Min frequency
    bandSize = (rate / 2) / (fft_w / 2)
    min_freqi = min_freq / bandSize
    max_freqi = max_freq / bandSize
    if max_freqi > (fft_w / 2):
        max_freqi = fft_w / 2

    spectro = sample[min_freqi:max_freqi, :]
    
    result = np.mean(spectro)

    return result

#t0 = time.time()
#resSPL = compute_SPL(selChannel, rate=rate, timeWindow=5, min_freq=0, max_freq=rate, fft_w=512, db_threshold=50)
#print("Time SPL for %s seconds: %s" % (len(frames) / rate, time.time() - t0))

# Time SPL for 600 seconds: 2.9470000267

