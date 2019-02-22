#!/usr/bin/env python
# -*- coding: utf-8 -*-

##########################################################################################
### FEATURES EXTRACTOR ###################################################################
### Author: Clausius Duque G. Reis (clausiusreis@gmail.com)                            ###
###                                                                                    ###
### Parameters:                                                                        ###
###    Audio channel:   0-left, 1-right                                                ###
###    Audio file path: Full path for the audio file                                   ###
##########################################################################################


##########################################################################################
### LIBRARIES ############################################################################
##########################################################################################

import numpy as np
import librosa

import os
import sys

import scipy.io.wavfile as wavfile

# Teste de tempo
import time
t0 = time.time()

##########################################################################################
### PARAMETERS ###########################################################################
##########################################################################################

#Definição do diretório a ser trabalhado
mainPath = sys.argv[1]

################################################################################
### MAIN PROGRAM ###############################################################
################################################################################

wdir = os.listdir(mainPath)
wdir.sort()
audios = [arq for arq in wdir if (arq.lower().endswith(".flac") | arq.lower().endswith(".wav"))]
audios.sort()

# print "################################################################################"
# print "### GENERATING SPECTROGRAMS ####################################################"
# print "################################################################################"

print "Processing directory: %s" % mainPath

#Crio diretórios para armazenar o resultado
os.system("mkdir %s/Extraction" % (mainPath))
os.system("mkdir %s/Extraction/AudioFeatures" % (mainPath))

for f in audios:           
    fileExt = {"flac", ".wav"}

    if (f[-4:] in fileExt):
         
        print "    Processing file: %s" % (f)

        #Verifico a extensão
        if (f[-4:] == 'flac'):
            currentFileFLAC = "%s/%s" % (mainPath, f)            
            os.system("flac -s -d %s" % (currentFileFLAC))

        # mainPath <- caminho onde estão os arquivos de áudio originais
        # currentFile <- Nome do arquivo com extensão (arquivo.wav)
        # fileIdent <- Nome do arquivo sem extensão (arquivo)        

        #Se o arquivo atual é FLAC removo o WAV criado        
        if (f[-4:] == 'flac'):            
            os.system("rm -rf %s" % (currentFileFLAC))

############################################################################
### Extract the features with R for now, will be ported to Python ##########
############################################################################

import rpy2.robjects as robjects

#####################################################################################################
# Realizar a configuração inicial e de cada feature baseado em um arquivo CSV
# Para cada linha (Com nome do feature na frente), rodar função de configuração passando parâmetros
#    setGeneralExtractionSettings(sampleSizeIndices = 1, soundChannel = "both", fileNameFormat = "")
#    setAEIExtractionSettings(max_freq, db_threshold, freq_step)
#    setCSHExtractionSettings(f, wl, wn, ovlp, fftw, threshold)
# Gerar um vetor (String) com o nome dos features
#    selectedFeatures = c(VETOR_FEATURES_SELECIONADOS)
#####################################################################################################

# Código para testes apenas com os 4 features usados no artigo
robjects.r('''
        featuresFromDir <- function(directory="") {
            source("./RCran/SoundscapeVICG_FeatureExtraction.R")
            setGeneralExtractionSettings(sampleSizeIndices = 1, soundChannel = "both", fileNameFormat = "")
            selectedFeatures = c("adi", "aci", "aei", "bio", "ndsi", "ndsi-a", "ndsi-b", "h", "mfcc", "acoustat", "crest", "csh", "roughness", "rugo", "m", "th", "twaveenv", "specprop", "zcr", "rms", "spl")
            extractFeatures(inputDirectory =  directory, selectedFeatures = selectedFeatures)
        }
        ''')

robjects.r("featuresFromDir(directory = '"+ mainPath +"')")

# Teste de tempo
t1 = time.time()
total = t1-t0
print("Time: %s" % total)    
    
print "#### PROCESSAMENTO FINALIZADO ####"

