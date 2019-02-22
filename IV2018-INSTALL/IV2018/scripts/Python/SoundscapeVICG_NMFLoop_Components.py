#!/usr/bin/env python
# -*- coding: utf-8 -*-

import numpy as np
import librosa
from scipy.io import wavfile

import os
#import sys
#import platform
import subprocess

# Teste de tempo
import time
t0 = time.time()

# Parameters
n_fft = 1024
n_components = 10
alpha=1.0
l1_ratio=0.0
inputPath = "/home/clausius/Documents/DOUTORADO/TEST_DATABASE/TEST"
outputPath = "%s/NMF" % (inputPath)

# List the main path audio files
wdir = os.listdir(inputPath)
wdir.sort()
audios = [arq for arq in wdir if (arq.lower().endswith(".flac") | arq.lower().endswith(".wav"))]
audios.sort()

#Verifico se o diretório existe. 
#   FALSE: crio o diretório. 
#   TRUE: Apago o diretório anterior e crio novamente.
if (os.path.isdir(outputPath) == False):
    os.system("mkdir %s" % (outputPath))
else:
    os.system("rm -rf %s" % (outputPath))
    time.sleep(1)
    os.system("mkdir %s" % (outputPath))

for f in audios:
    fileExt = {"flac", ".wav"}

    if (f[-4:] in fileExt):
         
        print "Processing file: %s" % (f)

        #Verifico a extensão
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
        
        masks = np.zeros((n_components, S.shape[0], S.shape[1]))
        for n in range(n_components):
            masks[n] = np.dot(W[:,[n]], H[[n]])
        mask_total = np.sum(masks, axis=0)
        mask_total += (mask_total == 0)

        for n in range(n_components):            
            Y_R = masks[n] / mask_total * S #Normalization
            #Y_R = masks[n] / S
            y_r = librosa.istft(Y_R)
            wavfile.write("%s/%s_Component_%s.wav" % (outputPath, fileIdent, n), sr, y_r)

        if (f[-4:] == 'flac'):
            subprocess.call("rm -rf %s" % (currentFile))

print("Finalizou o processamento!")

# Teste de tempo
t1 = time.time()
total = t1-t0
print("Time: %s" % total)





