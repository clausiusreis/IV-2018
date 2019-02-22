#!/usr/bin/env python
# -*- coding: utf-8 -*-

##########################################################################################
### SPECTROGRAM EXTRACTOR ################################################################
### Author: Clausius Duque G. Reis (clausiusreis@gmail.com)                            ###
###                                                                                    ###
### Parameters:                                                                        ###
###    Audio channel:   0-left, 1-right                                                ###
###    Colormap:        https://matplotlib.org/examples/color/colormaps_reference.html ###
###    Audio file path: Full path for the audio file                                   ###
##########################################################################################


##########################################################################################
### LIBRARIES ############################################################################
##########################################################################################

import matplotlib
matplotlib.use('Agg') #To run without X11

import matplotlib.pyplot as plt
import numpy as np
import librosa
from librosa import display

import os
import sys
import platform
import subprocess

import scipy.io.wavfile as wavfile

# Teste de tempo
import time
t0 = time.time()

##########################################################################################
### PARAMETERS ###########################################################################
##########################################################################################
testesClausius = False
typeColor = 2 # 0-BW 1-Color 2-Both
if (testesClausius==True):
    audioChannel = 0    
    cmap = "hot"
    wNFFT = 2048
    mainPath = "/home/clausius/Documents/DOUTORADO/TEST_DATABASE/TEST1"
    outputPath = "/home/clausius/Documents/DOUTORADO/TEST_DATABASE/TEST1"
    wALL = 10000
    topDB = 50 # hide anything below -50 dB
    yAxis = 'linear'
else: 
    #Select the audio channel, 0 = Left, 1 = Right
    audioChannel = int(sys.argv[1])

    #Defino o mapa de cores do espectrograma: https://matplotlib.org/examples/color/colormaps_reference.html    
    cmap = plt.get_cmap(sys.argv[2]) #hot

    #Defino a janela do FFT (Frequências)
    wNFFT = int(sys.argv[3])
    
    #Definição do diretório a ser trabalhado
    mainPath = sys.argv[4]
    
    #Definição do diretório para saída
    outputPath = sys.argv[5]
    
    #Defino a janela de tempo da extração
    wALL = int(sys.argv[6])
    
    #Intensidades minimas e máximas do espectrograma (dB)
    topDB = int(sys.argv[7])  # 50 will hide anything below -50 dB

    #Como o eixo Y é apresentado (log / linear)
    yAxis = sys.argv[8] # linear / log

################################################################################
### MAIN PROGRAM ###############################################################
################################################################################

# import platform
# if (str.lower(platform.system()) == "windows"):
#     print("Windows path pattern") 
# else:
#     print("Linux path pattern")

#Apago o que foi extraído anteriormente
#os.system("rm -rf %s/spectrogram" % (mainPath))

wdir = os.listdir(mainPath)
wdir.sort()
audios = [arq for arq in wdir if (arq.lower().endswith(".flac") | arq.lower().endswith(".wav"))]
audios.sort()

print "################################################################################"
print "### GENERATING SPECTROGRAMS ####################################################"
print "################################################################################"

print "Processing directory: %s" % mainPath

#Crio diretórios para armazenar o resultado
#os.system("mkdir %s/extraction/spectrogram" % (mainPath))
#os.system("mkdir %s/spectrogram/BW" % (outputPath))
#os.system("mkdir %s/spectrogram/Color" % (outputPath))
os.system("mkdir %s/Extraction" % (mainPath))
os.system("mkdir %s/Extraction/AudioSpectrogram" % (mainPath))


for f in audios:           
    fileExt = {"flac", ".wav"}

    if (f[-4:] in fileExt):
         
        print "    Processing file: %s" % (f)

        #Verifico a extensão
        if (f[-4:] == 'flac'):
            currentFileFLAC = "%s/%s" % (mainPath, f)
            
            os.system("flac -s -d %s" % (currentFileFLAC))
            

            fileIdent = f[:-5]                
            currentFile = "%s/%s.wav" % (mainPath, fileIdent)

        elif (f[-4:] == '.wav'):
            currentFileWAV = "%s/%s" % (mainPath, f)
            fileIdent = f[:-4]
            currentFile = currentFileWAV

        #################################################################################################
        ### Generate the audio spectrograms #############################################################
        #################################################################################################           
        
        #Load an audio file with separated samplerate, left and right channels            
        rate, frames = wavfile.read(currentFile)

        if (len(np.shape(frames)) == 1):
            selChannel = frames
        else:
            if (audioChannel == 0):
                selChannel = frames[:,0]
            else:
                selChannel = frames[:,1]        
 
        #Time window spectrogram
        for i in range(1, int(len(selChannel)/(wALL*rate)+2) ):
            print "        Time window: %s" % ((i-1)*wALL)
            if (len(selChannel) < ((i*wALL)*rate)): 
                soundSample = selChannel[(((i-1)*wALL)*rate):len(selChannel)]
            else:
                soundSample = selChannel[(((i-1)*wALL)*rate):((i*wALL)*rate)]
 
            # Extract the spectrogram matrix (STFT)
            D = librosa.stft(soundSample, n_fft=wNFFT)

            if ((typeColor == 0) | (typeColor == 2)):
                # BW Spectrogram
                fig, ax = plt.subplots()
                #fig.set_dpi=80
                fig.set_size_inches(7, 3)
                display.specshow(librosa.amplitude_to_db(D, ref=np.max, top_db=topDB), sr=rate, y_axis=yAxis, x_axis='time', cmap=plt.get_cmap("gist_gray"))
                ax.axis("tight")
                ax.set_xlabel('')
                ax.set_ylabel('Frequency (Hz)')
                ax.yaxis.tick_right()
                plt.colorbar(format='%+2.0f dB', pad=0.1)
                plt.tight_layout()
                   
                plt.savefig("%s/%s_Min%s_BW.png" % (outputPath, fileIdent, ((i-1)*wALL)), bbox_inches='tight')
                plt.close()
            
            if ((typeColor == 1) | (typeColor == 2)):
                # Color Spectrogram
                fig, ax = plt.subplots()
                #fig.set_dpi=80
                fig.set_size_inches(7, 3)
                display.specshow(librosa.amplitude_to_db(D, ref=np.max, top_db=topDB), sr=rate, y_axis=yAxis, x_axis='time', cmap=cmap)                
                ax.axis("tight")
                ax.set_xlabel('')
                ax.set_ylabel('Frequency (Hz)')
                ax.yaxis.tick_right()
                plt.colorbar(format='%+2.0f dB', pad=0.1)
                plt.tight_layout()
                    
                plt.savefig("%s/%s_Min%s_Color.png" % (outputPath, fileIdent, ((i-1)*wALL)), bbox_inches='tight') 
                plt.close()
                
        #Se o arquivo atual é FLAC removo o WAV criado        
        if (f[-4:] == 'flac'):            
            os.system("rm -rf %s" % (currentFile))

# Teste de tempo
t1 = time.time()
total = t1-t0
print("Time: %s" % total)    
    
print "#### PROCESSAMENTO FINALIZADO ####"

