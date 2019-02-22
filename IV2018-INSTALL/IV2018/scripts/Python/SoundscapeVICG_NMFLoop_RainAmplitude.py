#!/usr/bin/env python
# -*- coding: utf-8 -*-

import numpy as np
import librosa
from scipy.io import wavfile

import os
import sys

# Teste de tempo
import time
t0 = time.time()

##########################################################################################
### PARAMETERS ###########################################################################
##########################################################################################
tests = 0
if (tests == 1):
    n_fft = 1024
    n_components = 10
    alpha=1.0
    l1_ratio=0.0
    inputPath = "/home/clausius/Documents/DOUTORADO/TEST_DATABASE/TEST"
    outputPath = "%s/NMF" % (inputPath)
else:
    n_fft = int(sys.argv[1])
    n_components = int(sys.argv[2])
    alpha = float(sys.argv[3])
    l1_ratio = float(sys.argv[4])
    inputPath = sys.argv[5]
    outputPath = "%s/NMF" % (inputPath)

os.system("mkdir %s" % (outputPath))

# List the main path audio files
wdir = os.listdir(inputPath)
wdir.sort()
audios = [arq for arq in wdir if (arq.lower().endswith(".flac") | arq.lower().endswith(".wav"))]
audios.sort()

for f in audios:           
    fileExt = {"flac", ".wav"}

    if (f[-4:] in fileExt):
         
        print "Processing file: %s" % (f)

        #Verifico a extens�o
        if (f[-4:] == 'flac'):
            currentFileFLAC = "%s/%s" % (inputPath, f)
            
            #Converto o arquivo FLAC para WAV
            os.system("flac -s -d %s" % (currentFileFLAC))

            fileIdent = f[:-5]                
            currentFile = "%s/%s.wav" % (inputPath, fileIdent)

        elif (f[-4:] == '.wav'):
            currentFileWAV = "%s/%s" % (inputPath, f)
            fileIdent = f[:-4]
            currentFile = currentFileWAV
        
        #####################################################################################################################
        # Load the audio
        y, sr = librosa.load(currentFile, sr=None)

        # Spectrogram matrix
        S = librosa.stft(y, n_fft=n_fft)
        
        # NMF Decomposition
        # alpha: is the weight for the regularization. With alpha as zero, the components simply try to 
        #        minimize the error in reproducing the spectrogram.  
        # l1_ratio: controls the balance between l2 (total energy) and l1 (sparsity) in the regularization
        W, H = librosa.decompose.decompose(np.abs(S), n_components=n_components, sort=True, alpha=alpha, l1_ratio=l1_ratio)
        # W gives one spectral profile per component, 
        # H gives the corresponding time activations.
        
        masks = np.zeros((n_components, S.shape[0], S.shape[1]))
        for n in range(n_components):
            masks[n] = np.dot(W[:,[n]], H[[n]])
        mask_total = np.sum(masks, axis=0)
        mask_total += (mask_total == 0)
        
        # Detect the rain components in W
        means = np.ndarray(n_components)
        for n in range(n_components): 
            means[n] = round(masks[n].sum())

        nRain = 0
        nClean = 0
        for n in range(n_components): 
            if (means[n] > means.mean()):
                nRain = nRain + 1
            if (means[n] <= means.mean()):
                nClean = nClean + 1

        masksRain = range(nRain)
        masksClean = range(nClean)

        fRain = 0
        fClean = 0
        for n in range(n_components): 
            if (means[n] > means.mean()):
                masksRain[fRain] = n
                fRain = fRain + 1 
            if (means[n] < means.mean()):
                masksClean[fClean] = n
                fClean = fClean + 1

        print("Rain: %s" % masksRain)
        print("Clean: %s" % masksClean)

        # Reconstruct the audio
        if (nRain > 0):
            rain_components = masksRain
            mask = np.dot(W[:, rain_components], H[rain_components])
            Y_R = mask / (mask_total) * S
            #Y_R = mask / S
            y_r = librosa.istft(Y_R)            
            wavfile.write("%s/%s_Rain.wav" % (outputPath, fileIdent), sr, y_r)

        if (nClean > 0):
            clean_components = masksClean
            mask = np.dot(W[:, clean_components], H[clean_components])
            Y_R = mask / (mask_total) * S
            #Y_R = mask / S
            y_r = librosa.istft(Y_R)
            wavfile.write("%s/%s_Clean.wav" % (outputPath, fileIdent), sr, y_r)

#         for n in range(n_components):            
#             Y_R = masks[n] / mask_total * S
#             #Y_R = mask / S
#             y_r = librosa.istft(Y_R)
#             wavfile.write("%s/result/%s_Component_%s.wav" % (outputPath, fileIdent, n), sr, y_r)

print("Finalizou o processamento!")

# Teste de tempo
t1 = time.time()
total = t1-t0
print("Time: %s" % total)





