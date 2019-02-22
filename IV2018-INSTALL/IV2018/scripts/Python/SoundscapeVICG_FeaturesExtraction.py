# -*- coding: utf-8 -*-

#import matplotlib
#matplotlib.use('Agg') #To run without X11
import matplotlib.pyplot as plt
import numpy as np
import librosa
from librosa import display
import scipy.io.wavfile as wavfile
import IPython.display
from scipy import signal
import scipy.misc
from datetime import datetime
from math import sqrt
from scipy import stats
import time
import csv
import soundfile as sf
import json
import os
import sys
import pandas as pd
import shutil


### Available feature functions
import Features

### Unify and normalize the individual files
import UnifiedCSVGenerator as UG

##########################################################################################
### FEATURES EXTRACTOR ###################################################################
### Authors: Clausius Duque G. Reis (clausiusreis@gmail.com)                           ###
###          Thalisson Nobre Santos (thalisson.ns@gmail.com)                           ###
###                                                                                    ###
### Parameters:                                                                        ###
###    dbname: name of the database directory. Ex: ../../FILES/FET/dbname              ###
##########################################################################################

dbname = sys.argv[1]

def groupFeatures(feat, fileIdent, fileDateTimeMask):
    #firstCol = False

    resultMat = {}    
    selectedColNames = []

    if ('ACI' in feat):
        resultMat['ACI'] = resACI 
        selectedColNames = selectedColNames + ['ACI']

    if ('ADI' in feat):
        resultMat['ADI'] = resADI 
        selectedColNames = selectedColNames + ['ADI']

    if ('AEI' in feat):
        resultMat['AEI'] = resAEI 
        selectedColNames = selectedColNames + ['AEI']

    if ('BIO' in feat):
        resultMat['BIO'] = resBIO 
        selectedColNames = selectedColNames + ['BIO']

    if ('MFCC' in feat):
        for i in range(0,resMFCC.shape[1]):
            resultMat['MFCC_'+str(i)] = resMFCC[:,i]
        selectedColNames = selectedColNames + ['MFCC_'+str(i) for i in range(resMFCC.shape[1])]

    if ('NDSI' in feat):
        resultMat['NDSI'] = resNDSI
        resultMat['NDSI_Anthro'] = resNDSI_Anthro
        resultMat['NDSI_Bio'] = resNDSI_Bio
        selectedColNames = selectedColNames + ['NDSI', 'NDSI_Anthro', 'NDSI_Bio']
    
    if ('RMS' in feat):
        resultMat['RMS'] = resRMS 
        selectedColNames = selectedColNames + ['RMS']
    
    if ('TH' in feat):
        resultMat['TH'] = resTH 
        selectedColNames = selectedColNames + ['TH']
    
    if ('ZCR' in feat):
        resultMat['ZCR'] = resZCR 
        selectedColNames = selectedColNames + ['ZCR']
    
    if ('SpecMean' in feat):
        resultMat['SpecMean'] = resSpecPropMean 
        selectedColNames = selectedColNames + ['SpecMean']
    
    if ('SpecSD' in feat):
        resultMat['SpecSD'] = resSpecPropSD
        selectedColNames = selectedColNames + ['SpecSD']
    
    if ('SpecSEM' in feat):
        resultMat['SpecSEM'] = resSpecPropSEM
        selectedColNames = selectedColNames + ['SpecSEM']
    
    if ('SpecMedian' in feat):
        resultMat['SpecMedian'] = resSpecPropMedian 
        selectedColNames = selectedColNames + ['SpecMedian']

    if ('SpecMode' in feat):
        resultMat['SpecMode'] = resSpecPropMode 
        selectedColNames = selectedColNames + ['SpecMode']
    
    if ('SpecQuartile' in feat):
        resultMat['SpecQuartile25'] = resSpecPropQ25
        resultMat['SpecQuartile50'] = resSpecPropQ50
        resultMat['SpecQuartile75'] = resSpecPropQ75
        resultMat['SpecQuartileIQR'] = resSpecPropIQR
        selectedColNames = selectedColNames + ['SpecQuartile25', 'SpecQuartile50', 'SpecQuartile75', 'SpecQuartileIQR']

    if ('SpecSkewness' in feat):
        resultMat['SpecSkewness'] = resSpecPropSkewness
        selectedColNames = selectedColNames + ['SpecSkewness']
    
    if ('SpecKurtosis' in feat):
        resultMat['SpecKurtosis'] = resSpecPropKurtosis
        selectedColNames = selectedColNames + ['SpecKurtosis']
    
    if ('SpecEntropy' in feat):
        resultMat['SpecEntropy'] = resSpecPropEntropy
        selectedColNames = selectedColNames + ['SpecEntropy']
    
    if ('SpecVariance' in feat):
        resultMat['SpecVariance'] = resSpecPropVariance
        selectedColNames = selectedColNames + ['SpecVariance']
    
    if ('SpecChromaSTFT' in feat):
        resultMat['SpecChromaSTFT'] = resSpecChromaSTFT
        selectedColNames = selectedColNames + ['SpecChromaSTFT']
    
    if ('SpecChromaCQT' in feat):
        resultMat['SpecChromaCQT'] = resSpecChromaCQT
        selectedColNames = selectedColNames + ['SpecChromaCQT']
    
    if ('SpecCentroid' in feat):
        resultMat['SpecCentroid'] = resSpecCentroid
        selectedColNames = selectedColNames + ['SpecCentroid']
    
    if ('SpecBandwidth' in feat):
        resultMat['SpecBandwidth'] = resSpecBandwidth
        selectedColNames = selectedColNames + ['SpecBandwidth']
    
    if ('SpecContrast' in feat):
        resultMat['SpecContrast'] = resSpecContrast
        selectedColNames = selectedColNames + ['SpecContrast']
    
    if ('SpecRolloff' in feat):
        resultMat['SpecRolloff'] = resSpecRolloff
        selectedColNames = selectedColNames + ['SpecRolloff']
    
    if ('SpecPolyFeat' in feat):
        resultMat['SpecPolyFZero'] = resSpecPolyFeatures_Zero
        resultMat['SpecPolyFLinear'] = resSpecPolyFeatures_Linear
        resultMat['SpecPolyFQuadratic'] = resSpecPolyFeatures_Quadratic
        selectedColNames = selectedColNames + ['SpecPolyFZero', 'SpecPolyFLinear', 'SpecPolyFQuadratic']
    
    if ('SpecSpread' in feat):
        resultMat['SpecSpread'] = resSpread
        selectedColNames = selectedColNames + ['SpecSpread']
    
    if ('SPL' in feat):
        resultMat['SPL'] = resSPL
        selectedColNames = selectedColNames + ['SPL']
        
    ### Create first collumns of CSV #############################################################################        
    if (fileDateTimeMask != ""):
        fileDateTime = datetime.strptime(fileIdent, fileDateTimeMask)
        fileDate = fileDateTime.strftime('%Y-%m-%d')
        fileTime = fileDateTime.strftime('%H:%M:%S')
    else:
        fileDate = ""
        fileTime = ""


    firstCols = ["FileName","Date","Time","SecondsFromStart"]
    selectedColNames = firstCols + selectedColNames

    col0 = [fileIdent for i in range( len(resultMat[selectedColNames[4]]) )]
    col1 = [fileDate for i in range( len(resultMat[selectedColNames[4]]) )]
    col2 = [fileTime for i in range( len(resultMat[selectedColNames[4]]) )]
    col3 = [i*jsonData['GENERAL_timeWindow'] for i in range( len(resultMat[selectedColNames[4]]) )]
    
    resultMat['FileName'] = col0
    resultMat['Date'] = col1
    resultMat['Time'] = col2
    resultMat['SecondsFromStart'] = col3    
    
    return resultMat, selectedColNames

def extractionProcess(jsonData):    
    print("#### EXTRACTION PROCESS BEGIN ####")
    print "Processing directory: %s" % jsonData['GENERAL_mainPath']

    #REMOVER TODOS OS ARQUIVOS ANTERIORES

    ### Crio diretórios para armazenar o resultado ###############################################################
    if not os.path.exists("%s/Extraction" % (jsonData['GENERAL_mainPath'])):
        os.makedirs("%s/Extraction" % (jsonData['GENERAL_mainPath']))    
    
    if not os.path.exists("%s/Extraction/AudioFeatures" % (jsonData['GENERAL_mainPath'])):
        os.makedirs("%s/Extraction/AudioFeatures" % (jsonData['GENERAL_mainPath']))
    else:
        shutil.rmtree( "%s/Extraction/AudioFeatures" % (jsonData['GENERAL_mainPath']) )
        time.sleep(2)
        os.makedirs("%s/Extraction/AudioFeatures" % (jsonData['GENERAL_mainPath']))

    if not os.path.exists("%s/Extraction/AudioMP3" % (jsonData['GENERAL_mainPath'])):
        os.makedirs("%s/Extraction/AudioMP3" % (jsonData['GENERAL_mainPath']))

    if not os.path.exists("%s/Extraction/AudioSpectrogram" % (jsonData['GENERAL_mainPath'])):
        os.makedirs("%s/Extraction/AudioSpectrogram" % (jsonData['GENERAL_mainPath']))

    wdir = os.listdir(jsonData['GENERAL_mainPath'])
    wdir.sort()
    audios = [arq for arq in wdir if (arq.lower().endswith(".flac") | arq.lower().endswith(".mp3") | arq.lower().endswith(".wav"))]
    audios.sort()
    
    for f in audios:           
        fileExt = {"flac", ".mp3", ".wav"}
    
        global audioType
        audioType = f[-4:]
        
        if (f[-4:] in fileExt): 
            ##Check the extension MP3 need to be extracted
            if (f[-4:].lower() == '.mp3'):
                print "    Extracting MP3 file to WAV: %s" % ( f )
                currentFileMP3 = "%s/%s" % (jsonData['GENERAL_mainPath'], f)                                
                os.system("yes | ffmpeg -i %s %s.wav" % (currentFileMP3, currentFileMP3[:-4]))
    
    ##############################################################################################################
    ### BEGIN OF FILES LOOP ######################################################################################
    ##############################################################################################################
    wdir = os.listdir(jsonData['GENERAL_mainPath'])
    #wdir.sort()
    audios = [arq for arq in wdir if (arq.lower().endswith(".flac") | arq.lower().endswith(".wav"))]
    audios.sort()
    
    totAudios = 0
    totSamples = 0 
    for f in audios:
        # Teste de tempo        
        tt0 = time.time()
        
        totAudios = totAudios + 1
         
        print "    Processing file: %s" % ( f )
 
        currentFileWAV = "%s/%s" % (jsonData['GENERAL_mainPath'], f)
        if f[-4:] == 'flac':
            fileIdent = f[:-5]
        else:
            fileIdent = f[:-4]
        currentFile = currentFileWAV

        ##############################################################################################################
        ### Convert the files to MP3 for the player ##################################################################
        ##############################################################################################################
        if not os.path.exists("%s/Extraction/AudioMP3/%s.mp3" % (jsonData['GENERAL_mainPath'], fileIdent)):
            os.system("yes | ffmpeg -i %s -vn -f mp3 %s/Extraction/AudioMP3/%s.mp3" % (currentFile, jsonData['GENERAL_mainPath'], fileIdent))

        ##############################################################################################################
        ### Chamada de função para extração dos features #############################################################
        ##############################################################################################################
        #Load an audio file with separated samplerate, left and right channels            
        #rate, frames = wavfile.read(currentFile)    
        frames, rate = sf.read(currentFile)
         
        # Pego um canal apenas
        if (len(np.shape(frames)) == 1):
            selChannel = frames
        else:
            if (jsonData['GENERAL_audioChannel'] == 0):
                selChannel = frames[:,0]
            else:
                selChannel = frames[:,1]    

        ##############################################################################################################
        ### CREATE AN AUDIO SPECTROGRAM OF THE ENTIRE FILE ###########################################################
        ##############################################################################################################
        if not os.path.exists("%s/Extraction/AudioSpectrogram/%s.png" % (jsonData['GENERAL_mainPath'], fileIdent)):
            spec_width = 600
            spec_height = 270
            speccmap = plt.cm.jet
            spectro = librosa.stft(selChannel, n_fft=2048, window=scipy.signal.blackmanharris)
            specMatrixDB = librosa.amplitude_to_db(spectro, ref=np.max, top_db=jsonData['GENERAL_dbThreshold'])
            specMatrixDB1 = np.flipud(specMatrixDB)
            norm = plt.Normalize(vmin=specMatrixDB1.min(), vmax=specMatrixDB1.max())
            image = speccmap(norm(specMatrixDB1))        
            newImage = scipy.misc.imresize(image, (spec_height, spec_width))
            plt.imsave("%s/Extraction/AudioSpectrogram/%s.png" % (jsonData['GENERAL_mainPath'], fileIdent), newImage)
     
        
        ##############################################################################################################
        ### BEGIN OF TIME WINDOW LOOP ################################################################################
        ##############################################################################################################
        sampleWindow = jsonData['GENERAL_timeWindow'] * rate
        numSamples = len(selChannel)/sampleWindow
        audioSeconds = int(len(frames)/rate)
        
        #TODO: Gerar csv com info do áudio        
        with open("/".join([jsonData['GENERAL_mainPath'], "Extraction/AudioMP3", fileIdent+'_info.csv']), 'w') as outfileinfo:            
            outfileinfo.write("maxFreq,sampleWindow,audioSeconds\n")
            outfileinfo.write("%s,%s,%s" % (rate/2, jsonData['GENERAL_timeWindow'], int(len(frames)/rate)))         
                
        ### Define each as global to group them at the end
        global result
        global resACI
        global resADI
        global resAEI
        global resBIO
        global resMFCC 
        global resNDSI 
        global resNDSI_Anthro
        global resNDSI_Bio
        global resRMS 
        global resTH
        global resZCR
        global resSpecPropMean
        global resSpecPropSD
        global resSpecPropSEM
        global resSpecPropMedian
        global resSpecPropMode
        global resSpecPropQ25
        global resSpecPropQ50
        global resSpecPropQ75
        global resSpecPropIQR
        global resSpecPropSkewness
        global resSpecPropKurtosis
        global resSpecPropEntropy
        global resSpecPropVariance
        global resSpecChromaSTFT
        global resSpecChromaCQT
        global resSpecCentroid
        global resSpecBandwidth
        global resSpecContrast
        global resSpecRolloff
        global resSpecPolyFeatures_Zero
        global resSpecPolyFeatures_Linear
        global resSpecPolyFeatures_Quadratic
        global resSpread
        global resSPL
         
        result = np.zeros(numSamples)        
        resACI = np.zeros(numSamples)
        resADI = np.zeros(numSamples)
        resAEI = np.zeros(numSamples)
        resBIO = np.zeros(numSamples)
        resMFCC = np.zeros(((numSamples,jsonData['MFCC_numcep'])))
        resNDSI = np.zeros(numSamples)
        resNDSI_Anthro = np.zeros(numSamples)
        resNDSI_Bio = np.zeros(numSamples)
        resRMS = np.zeros(numSamples)
        resTH = np.zeros(numSamples)
        resZCR = np.zeros(numSamples)
        resSpecPropMean = np.zeros(numSamples)
        resSpecPropSD = np.zeros(numSamples)
        resSpecPropSEM = np.zeros(numSamples)
        resSpecPropMedian = np.zeros(numSamples)
        resSpecPropMode = np.zeros(numSamples)
        resSpecPropQ25 = np.zeros(numSamples)
        resSpecPropQ50 = np.zeros(numSamples)
        resSpecPropQ75 = np.zeros(numSamples)
        resSpecPropIQR = np.zeros(numSamples)
        resSpecPropSkewness = np.zeros(numSamples)
        resSpecPropKurtosis = np.zeros(numSamples)
        resSpecPropEntropy = np.zeros(numSamples)
        resSpecPropVariance = np.zeros(numSamples)
        resSpecChromaSTFT = np.zeros(numSamples)
        resSpecChromaCQT = np.zeros(numSamples)
        resSpecCentroid = np.zeros(numSamples)
        resSpecBandwidth = np.zeros(numSamples)
        resSpecContrast = np.zeros(numSamples)
        resSpecRolloff = np.zeros(numSamples)
        resSpecPolyFeatures_Zero = np.zeros(numSamples)
        resSpecPolyFeatures_Linear = np.zeros(numSamples)
        resSpecPolyFeatures_Quadratic = np.zeros(numSamples)
        resSpread = np.zeros(numSamples)
        resSPL = np.zeros(numSamples)

        for si in range(numSamples):
            
            totSamples = totSamples + 1
            
            # Set the time window to extract audio sample    
            time0 = (si)*sampleWindow
            time1 = (si+1)*sampleWindow
            if time1 > len(selChannel):
                time1 = len(selChannel)-1
         
            sample  = selChannel[time0:time1]
             
            sampleDB = {}
            samplePWR = {}
            for f in jsonData['GENERAL_featuresToCalculate']:                    
                try:
                    if jsonData[f+'_fft_w'] not in sampleDB:
                        spectro = librosa.stft( sample, n_fft=jsonData[f+'_fft_w'] )
                        specDB  = librosa.amplitude_to_db(spectro, ref=np.max, top_db=jsonData['GENERAL_dbThreshold'])
                        specPWR = librosa.db_to_power(specDB, ref=1.0)
                        
                        #TODO: Confirmar esta chamada 
                        sampleDB[jsonData[f+'_fft_w']]  = specDB
                        samplePWR[jsonData[f+'_fft_w']] = specPWR
                except:
                    pass

            ### Acoustic Complesity ######################################################################################            
            if ('ACI' in jsonData['GENERAL_featuresToCalculate']):
                resACI[si] = Features.compute_ACI(
                            sample          = samplePWR[jsonData['ACI_fft_w']],
                            rate            = rate,
                            timeWindow      = jsonData['GENERAL_timeWindow'],
                            min_freq        = jsonData['ACI_min_freq'], 
                            max_freq        = jsonData['ACI_max_freq'], 
                            j_bin           = jsonData['ACI_j_bin'], 
                            fft_w           = jsonData['ACI_fft_w'], 
                            db_threshold    = jsonData['GENERAL_dbThreshold'])
  
            ### Acoustic Diversity #######################################################################################    
            if ('ADI' in jsonData['GENERAL_featuresToCalculate']):
                resADI[si] = Features.compute_ADI(
                            sample          = sampleDB[jsonData['ADI_fft_w']],
                            rate            = rate,
                            timeWindow      = jsonData['GENERAL_timeWindow'],                            
                            max_freq        = jsonData['ADI_max_freq'], 
                            freq_step       = jsonData['ADI_freq_step'], 
                            fft_w           = jsonData['ADI_fft_w'], 
                            db_threshold    = jsonData['GENERAL_dbThreshold'])
              
            ### Acoustic Evenness ########################################################################################
            if ('AEI' in jsonData['GENERAL_featuresToCalculate']):
                resAEI[si] = Features.compute_AEI(
                            sample          = sampleDB[jsonData['AEI_fft_w']],
                            rate            = rate,
                            timeWindow      = jsonData['GENERAL_timeWindow'],
                            max_freq        = jsonData['AEI_max_freq'], 
                            freq_step       = jsonData['AEI_freq_step'], 
                            fft_w           = jsonData['AEI_fft_w'],
                            db_threshold    = jsonData['GENERAL_dbThreshold'])
              
            ### Bioacoustic Index ########################################################################################
            if ('BIO' in jsonData['GENERAL_featuresToCalculate']):
                resBIO[si] = Features.compute_BIO(
                            sample          = sampleDB[jsonData['BIO_fft_w']], 
                            rate            = rate,
                            timeWindow      = jsonData['GENERAL_timeWindow'],
                            min_freq        = jsonData['BIO_min_freq'], 
                            max_freq        = jsonData['BIO_max_freq'], 
                            fft_w           = jsonData['BIO_fft_w'],
                            db_threshold    = jsonData['GENERAL_dbThreshold'])    
              
            ### MFCC - Mel Frequency Cepstral Coefficients ###############################################################
            if ('MFCC' in jsonData['GENERAL_featuresToCalculate']):
                resMFCC[si] = Features.compute_MFCC(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        numcep          = jsonData['MFCC_numcep'], 
                        min_freq        = jsonData['MFCC_min_freq'], 
                        max_freq        = jsonData['MFCC_max_freq'], 
                        useMel          = False if (jsonData['MFCC_useMel'] == "False") else True )
               
            ### NDSI - Normalized Difference Soundscape Index ############################################################
            if ('NDSI' in jsonData['GENERAL_featuresToCalculate']):
                resNDSI[si], resNDSI_Anthro[si], resNDSI_Bio[si] = Features.compute_NDSI(
                            soundMono       = sample,   
                            rate            = rate,
                            timeWindow      = jsonData['GENERAL_timeWindow'],
                            fft_w           = jsonData['NDSI_fft_w'],
                            anthrophony     = jsonData['NDSI_anthrophony'], 
                            biophony        = jsonData['NDSI_biophony'])
   
            ### RMS Energy ###############################################################################################
            if ('RMS' in jsonData['GENERAL_featuresToCalculate']):
                resRMS[si] = Features.compute_RMS_Energy(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'] )
               
            ### Temporal Entropy #########################################################################################
            if ('TH' in jsonData['GENERAL_featuresToCalculate']):
                resTH[si] = Features.compute_TH(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'] )
               
            ### Zero Crossing Rate #######################################################################################
            if ('ZCR' in jsonData['GENERAL_featuresToCalculate']):
                resZCR[si] = Features.compute_ZCR(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'] )    
           
            ### Spectral Mean ############################################################################################
            if ('SpecMean' in jsonData['GENERAL_featuresToCalculate']):
                resSpecPropMean[si] = Features.compute_SpecProp_Mean(
                        sample          = samplePWR[jsonData['SpecMean_fft_w']], 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecMean_min_freq'], 
                        max_freq        = jsonData['SpecMean_max_freq'], 
                        fft_w           = jsonData['SpecMean_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'] )
           
            ### Spectral Standard Deviation ##############################################################################
            if ('SpecSD' in jsonData['GENERAL_featuresToCalculate']):
                resSpecPropSD[si] = Features.compute_SpecProp_SD(
                        sample          = samplePWR[jsonData['SpecSD_fft_w']], 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecSD_min_freq'], 
                        max_freq        = jsonData['SpecSD_max_freq'], 
                        fft_w           = jsonData['SpecSD_fft_w'],
                        db_threshold    = jsonData['GENERAL_dbThreshold'] ) 
           
            ### Spectral Standard Error Mean #############################################################################
            if ('SpecSEM' in jsonData['GENERAL_featuresToCalculate']):
                resSpecPropSEM[si] = Features.compute_SpecProp_SEM(
                        sample          = samplePWR[jsonData['SpecSEM_fft_w']], 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecSEM_min_freq'], 
                        max_freq        = jsonData['SpecSEM_max_freq'], 
                        fft_w           = jsonData['SpecSEM_fft_w'],
                        db_threshold    = jsonData['GENERAL_dbThreshold'])
    
            ### Spectral Median ##########################################################################################
            if ('SpecMedian' in jsonData['GENERAL_featuresToCalculate']):
                resSpecPropMedian[si] = Features.compute_SpecProp_Median(
                        sample          = samplePWR[jsonData['SpecMedian_fft_w']], 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecMedian_min_freq'], 
                        max_freq        = jsonData['SpecMedian_max_freq'], 
                        fft_w           = jsonData['SpecMedian_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'])
             
            ### Spectral Mode ############################################################################################
            if ('SpecMode' in jsonData['GENERAL_featuresToCalculate']):
                resSpecPropMode[si] = Features.compute_SpecProp_Mode(
                        sample          = samplePWR[jsonData['SpecMode_fft_w']], 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecMode_min_freq'], 
                        max_freq        = jsonData['SpecMode_max_freq'], 
                        fft_w           = jsonData['SpecMode_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'])
           
            ### Spectral Quartile ########################################################################################
            if ('SpecQuartile' in jsonData['GENERAL_featuresToCalculate']):
                resSpecPropQ25[si], resSpecPropQ50[si], resSpecPropQ75[si], resSpecPropIQR[si] = Features.compute_SpecProp_Quartiles(
                        sample          = samplePWR[jsonData['SpecQuartile_fft_w']], 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecQuartile_min_freq'], 
                        max_freq        = jsonData['SpecQuartile_max_freq'], 
                        fft_w           = jsonData['SpecQuartile_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'])
       
            ### Spectral Skewness ########################################################################################
            if ('SpecSkewness' in jsonData['GENERAL_featuresToCalculate']):
                   
                if jsonData['SpecSkewness_power'] == True:
                    sampleChosen = samplePWR[jsonData['SpecSkewness_fft_w']]
                else:
                    sampleChosen = sampleDB[jsonData['SpecSkewness_fft_w']]                    
                       
                resSpecPropSkewness[si] = Features.compute_SpecProp_Skewness(
                        sample          = sampleChosen, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecSkewness_min_freq'], 
                        max_freq        = jsonData['SpecSkewness_max_freq'], 
                        fft_w           = jsonData['SpecSkewness_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'], 
                        power           = False if (jsonData['SpecSkewness_power'] == "False") else True )
           
            ### Spectral Kurtosis ########################################################################################
            if ('SpecKurtosis' in jsonData['GENERAL_featuresToCalculate']):
                   
                if jsonData['SpecKurtosis_power'] == True:
                    sampleChosen = samplePWR[jsonData['SpecKurtosis_fft_w']]
                else:
                    sampleChosen = sampleDB[jsonData['SpecKurtosis_fft_w']]

                resSpecPropKurtosis[si] = Features.compute_SpecProp_Kurtosis(
                        sample          = sampleChosen, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecKurtosis_min_freq'],
                        max_freq        = jsonData['SpecKurtosis_max_freq'], 
                        fft_w           = jsonData['SpecKurtosis_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'], 
                        power           = False if (jsonData['SpecKurtosis_power'] == "False") else True )  
           
            ### Spectral Entropy #########################################################################################
            if ('SpecEntropy' in jsonData['GENERAL_featuresToCalculate']):
                   
                if jsonData['SpecEntropy_power'] == True:
                    sampleChosen = samplePWR[jsonData['SpecEntropy_fft_w']]
                else:
                    sampleChosen = sampleDB[jsonData['SpecEntropy_fft_w']]
   
                resSpecPropEntropy[si] = Features.compute_SpecProp_Entropy(
                        sample          = sampleChosen, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecEntropy_min_freq'],
                        max_freq        = jsonData['SpecEntropy_max_freq'],
                        fft_w           = jsonData['SpecEntropy_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'], 
                        power           = False if (jsonData['SpecEntropy_power'] == "False") else True ) 
           
            ### Spectral Variance #########################################################################################
            if ('SpecVariance' in jsonData['GENERAL_featuresToCalculate']):
                   
                if jsonData['SpecVariance_power'] == True:
                    sampleChosen = samplePWR[jsonData['SpecVariance_fft_w']]
                else:
                    sampleChosen = sampleDB[jsonData['SpecVariance_fft_w']]
                   
                resSpecPropVariance[si] = Features.compute_SpecProp_Variance(
                        sample          = sampleChosen, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecVariance_min_freq'], 
                        max_freq        = jsonData['SpecVariance_max_freq'], 
                        fft_w           = jsonData['SpecVariance_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'], 
                        power           = False if (jsonData['SpecVariance_power'] == "False") else True ) 
           
            ### Spectral Chroma STFT ######################################################################################
            if ('SpecChromaSTFT' in jsonData['GENERAL_featuresToCalculate']):
                   
                if jsonData['SpecChromaSTFT_power'] == True:
                    sampleChosen = samplePWR[jsonData['SpecChromaSTFT_fft_w']]
                else:
                    sampleChosen = sampleDB[jsonData['SpecChromaSTFT_fft_w']]
                   
                resSpecChromaSTFT[si] = Features.compute_SpecProp_Chroma_STFT(
                        sample          = sampleChosen, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecChromaSTFT_min_freq'], 
                        max_freq        = jsonData['SpecChromaSTFT_max_freq'], 
                        fft_w           = jsonData['SpecChromaSTFT_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'], 
                        power           = False if (jsonData['SpecChromaSTFT_power'] == "False") else True )
           
            ### Spectral Chroma CQT #######################################################################################
            if ('SpecChromaCQT' in jsonData['GENERAL_featuresToCalculate']):
                resSpecChromaCQT[si] = Features.compute_SpecProp_Chroma_CQT(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'])
           
            ### Spectral Centroid #########################################################################################
            if ('SpecCentroid' in jsonData['GENERAL_featuresToCalculate']):
                resSpecCentroid[si] = Features.compute_SpecProp_Centroid(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        fft_w           = jsonData['SpecCentroid_fft_w'])
           
            ### Spectral Bandwidth ########################################################################################
            if ('SpecBandwidth' in jsonData['GENERAL_featuresToCalculate']):
                resSpecBandwidth[si] = Features.compute_SpecProp_Bandwidth(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        fft_w           = jsonData['SpecBandwidth_fft_w'])
           
            ### Spectral Contrast ########################################################################################
            if ('SpecContrast' in jsonData['GENERAL_featuresToCalculate']):
                resSpecContrast[si] = Features.compute_SpecProp_Contrast(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        fft_w           = jsonData['SpecContrast_fft_w'])
   
            ### Spectral Rolloff #########################################################################################
            if ('SpecRolloff' in jsonData['GENERAL_featuresToCalculate']):
                resSpecRolloff[si] = Features.compute_SpecProp_Rolloff(
                        soundMono       = sample, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        fft_w           = jsonData['SpecRolloff_fft_w'])
           
            ### Spectral Poly Features ###################################################################################
            if ('SpecPolyFeat' in jsonData['GENERAL_featuresToCalculate']):
                   
                if jsonData['SpecPolyFeat_power'] == True:
                    sampleChosen = samplePWR[jsonData['SpecPolyFeat_fft_w']]
                else:
                    sampleChosen = sampleDB[jsonData['SpecPolyFeat_fft_w']]
                   
                resSpecPolyFeatures_Zero[si], resSpecPolyFeatures_Linear[si], resSpecPolyFeatures_Quadratic[si] = Features.compute_SpecProp_PolyFeatures(
                        sample          = sampleChosen, 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SpecPolyFeat_min_freq'], 
                        max_freq        = jsonData['SpecPolyFeat_max_freq'], 
                        fft_w           = jsonData['SpecPolyFeat_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'], 
                        power           = False if (jsonData['SpecPolyFeat_power'] == "False") else True )
       
            ### Spectral Spread ##########################################################################################
            if ('SpecSpread' in jsonData['GENERAL_featuresToCalculate']):
                resSpread[si] = Features.compute_SpecSpread(
                        soundMono       = sample,
                        sample          = sampleDB[jsonData['SpecSpread_fft_w']],                         
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        fft_w           = jsonData['SpecSpread_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'])
           
            ### SPL ######################################################################################################
            if ('SPL' in jsonData['GENERAL_featuresToCalculate']):
                resSPL[si] = Features.compute_SPL(
                        sample          = sampleDB[jsonData['SPL_fft_w']], 
                        rate            = rate, 
                        timeWindow      = jsonData['GENERAL_timeWindow'], 
                        min_freq        = jsonData['SPL_min_freq'], 
                        max_freq        = jsonData['SPL_max_freq'], 
                        fft_w           = jsonData['SPL_fft_w'], 
                        db_threshold    = jsonData['GENERAL_dbThreshold'])
                      
        ### Assemble all arrays into a matrix ########################################################################        
        result, selectedColNames = groupFeatures(
            jsonData['GENERAL_featuresToCalculate'], 
            fileIdent, 
            jsonData['GENERAL_fileDateTimeMask'])
        
        ### Save CSV with our extraction format
        dataframe = pd.DataFrame(result, columns = selectedColNames)
        dataframe.to_csv("/".join([jsonData['GENERAL_mainPath'], "Extraction/AudioFeatures", fileIdent+'.csv']), index=False)        

        tt1 = time.time()
        totalTime = tt1 - tt0
        print("        Saving Time: %s" % totalTime)

    ### Save DB info
    dbnamesplit = dbname.split("/")
    currentdb = dbnamesplit[len(dbnamesplit)-1]
    with open("/".join([jsonData['GENERAL_mainPath'], "Extraction/dbinfo.csv"]), 'w') as outfileinfo:            
        outfileinfo.write("dbname,numfiles,numsamples,samplewindow\n")
        outfileinfo.write("%s,%s,%s,%s" % (currentdb, totAudios, totSamples, jsonData['GENERAL_timeWindow']))         

    ##############################################################################################################
    ### END OF LOOP ##############################################################################################
    ##############################################################################################################
  
    UG.unifyCSV(mainPath = jsonData['GENERAL_mainPath'],
             resultingCSVName = "features",
             groupingOperation = jsonData['GENERAL_groupingOperation'], 
             normalizationOperation = jsonData['GENERAL_normalizationOperation'], 
             removeOutliers = jsonData['GENERAL_removeOutliers'])

    #Apago o resulting file para não ocupar muito espaço.
    #print("REMOVE features.csv: %s/Extraction/features.csv" % (jsonData['GENERAL_mainPath'])  )
    #os.remove("%s/Extraction/features.csv" % (jsonData['GENERAL_mainPath']))    
          
    print "#### EXTRACTION PROCESS FINISH ####"
      
    time.sleep(1)    
      
    if (audioType == '.mp3'):
        os.system("rm -rf %s/*.wav" % (jsonData['GENERAL_mainPath']))

##############################################################################################################
### Parâmetros do código #####################################################################################
##############################################################################################################

jsonData = json.load(open(dbname + '/Extraction/parameters.json'))
extractionProcess(jsonData=jsonData)

# Formatação de data (Teremos que montar um sistema de gerar essas máscaras na página WEB)

#  %a  Locale’s abbreviated weekday name.
#  %A  Locale’s full weekday name.      z
#  %b  Locale’s abbreviated month name.     
#  %B  Locale’s full month name.
#  %c  Locale’s appropriate date and time representation.   
#  %d  Day of the month as a decimal number [01,31].    
#  %f  Microsecond as a decimal number [0,999999], zero-padded on the left
#  %H  Hour (24-hour clock) as a decimal number [00,23].    
#  %I  Hour (12-hour clock) as a decimal number [01,12].    
#  %j  Day of the year as a decimal number [001,366].   
#  %m  Month as a decimal number [01,12].   
#  %M  Minute as a decimal number [00,59].      
#  %p  Locale’s equivalent of either AM or PM.
#  %S  Second as a decimal number [00,61].
#  %U  Week number of the year (Sunday as the first day of the week)
#  %w  Weekday as a decimal number [0(Sunday),6].   
#  %W  Week number of the year (Monday as the first day of the week)
#  %x  Locale’s appropriate date representation.    
#  %X  Locale’s appropriate time representation.    
#  %y  Year without century as a decimal number [00,99].    
#  %Y  Year with century as a decimal number.   
#  %z  UTC offset in the form +HHMM or -HHMM.
#  %Z  Time zone name (empty string if the object is naive).    
#  %%  A literal '%' character.

# In[]:


