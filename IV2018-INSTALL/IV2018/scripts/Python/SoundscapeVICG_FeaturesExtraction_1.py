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

# ### Available feature functions
# import Features
# 
# ### Unify and normalize the individual files
# import UnifiedCSVGenerator as UG

##########################################################################################
### FEATURES EXTRACTOR ###################################################################
### Authors: Clausius Duque G. Reis (clausiusreis@gmail.com)                           ###
###          Thalisson Nobre Santos (thalisson.ns@gmail.com)                           ###
###                                                                                    ###
### Parameters:                                                                        ###
###    dbname: name of the database directory. Ex: ../../FILES/FET/dbname              ###
##########################################################################################

dbname = sys.argv[1]    

#jsonData = json.load(open('/home/clausius/public_html/DOUTORADO_Resultados/scripts/'+dbname + '/Extraction/parameters.json'))

os.makedirs("%s/Extraction/AudioFeatures" % (dbname))