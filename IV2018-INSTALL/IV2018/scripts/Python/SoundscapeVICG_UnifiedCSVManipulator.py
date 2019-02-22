#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import csv
import sys
import numpy as np
import pandas as pd
from sklearn import preprocessing

################################################################################
### PROGRAMA PRINCIPAL #########################################################
################################################################################
#Just for testing performance
import time
start_time = time.time()

# Directory where the audio files are stored
mainPath = sys.argv[1]
#mainPath = '/home/clausius/Documents/DOUTORADO/TEST_DATABASE/TEST1'

currentFile = sys.argv[2]
#currentFile = 'Features.csv'

groupingOperation = sys.argv[3]
#groupingOperation = 'none' # none, mean, median

# normalizationOperation: type of normalization: 
#     n0 - without normalization
#     n1 - standardization ((x-mean)/sd)
#     n2 - positional standardization ((x-median)/mad)
#     n3 - unitization ((x-mean)/range)
#     n3a - positional unitization ((x-median)/range)
#     n4 - unitization with zero minimum ((x-min)/range)
#     n5 - normalization in range <-1,1> ((x-mean)/max(abs(x-mean)))
#     n5a - positional normalization in range <-1,1> ((x-median)/max(abs(x-median)))
#     n6 - quotient transformation (x/sd)
#     n6a - positional quotient transformation (x/mad)
#     n7 - quotient transformation (x/range)
#     n8 - quotient transformation (x/max)
#     n9 - quotient transformation (x/mean)
#     n9a - positional quotient transformation (x/median)
#     n10 - quotient transformation (x/sum)
# x    n11 - quotient transformation (x/sqrt(SSQ))
#     n12 - normalization ((x-mean)/sqrt(sum((x-mean)^2)))
#     n12a - positional normalization ((x-median)/sqrt(sum((x-median)^2)))
# x    n13 - normalization with zero being the central point ((x-midrange)/(range/2))
normalizationOperation = sys.argv[4]
#normalizationOperation = 'n4'


# Function to remove outliers
removeOutliers = False;
def removeOutliersFromData(data):
    l = data.shape[0];
    c = data.shape[1];    
        
    # Only show data within 3 standard deviations of the mean. 
    # If data is normally distributed 99.7% will fall in this range.        
    for j in range(1, c):
        auxsum = 0; # stores sum of elements
        auxsumsq = 0; # stores sum of squares
        
        for i in range(0, l):
            auxsum += data[data.columns[j]][i];
            auxsumsq += data[data.columns[j]][i] * data[data.columns[j]][i];
    
        mean = auxsum / l;
        varience = auxsumsq / l - mean * mean;
        sd = np.sqrt(varience);
        
        for i in range(0, l):
            if ( (data[data.columns[j]][i] > (mean + 3 * sd)) | (data[data.columns[j]][i] < (mean - 3 * sd)) ):
                data[data.columns[j]][i] = mean;

    return data;


print("#### PROCESSING CSV ####")
print("")
print "Processing file: %s/%s" % (mainPath, currentFile)

#load original CSV
df = pd.read_csv("%s/Extraction/%s" % (mainPath, currentFile))

### DATA GROUPING ###################################################################################
if (groupingOperation == "mean"):
    result = df.groupby(['FileName', 'Date', 'Time']).mean()
    result = pd.DataFrame(result)
    result.to_csv('%s/Extraction/%s_mean.csv' % (mainPath, currentFile[:-4]), delimiter=',')

if (groupingOperation == "median"):
    result = df.groupby(['FileName', 'Date', 'Time']).median()
    result = pd.DataFrame(result)
    result.to_csv('%s/Extraction/%s_median.csv' % (mainPath, currentFile[:-4]), delimiter=',')

if (groupingOperation == "none"):
    result = df.groupby(['FileName', 'SecondsFromStart']).mean()
    result = pd.DataFrame(result)

### REMOVE OUTLIERS #################################################################################
if (removeOutliers):
    result = removeOutliersFromData(result)    

### NORMALIZATION ###################################################################################
#def normalize(df):
#    result = df.copy()
#    for feature_name in df.columns:
#        max_value = df[feature_name].max()
#        min_value = df[feature_name].min()
#        result[feature_name] = (df[feature_name] - min_value) / (max_value - min_value)
#    return result

# n1 - standardization ((x-mean)/sd)
if (normalizationOperation == 'n1'):    
    normalized_df=(result-result.mean())/result.std()
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n1.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n2 - positional standardization ((x-median)/mad)
if (normalizationOperation == 'n2'):
    normalized_df=(result-result.median())/(result.mad())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n2.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')
    
# n3 - unitization ((x-mean)/range)
if (normalizationOperation == 'n3'):    
    normalized_df=(result-result.mean())/(result.max()-result.min())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n3.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n3a - positional unitization ((x-median)/range)
if (normalizationOperation == 'n3a'):    
    normalized_df=(result-result.median())/(result.max()-result.min())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n3a.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n4 - unitization with zero minimum ((x-min)/range)
if (normalizationOperation == 'n4'):    
    normalized_df=(result-result.min())/(result.max()-result.min())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n4.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n5 - normalization in range <-1,1> ((x-mean)/max(abs(x-mean)))
if (normalizationOperation == 'n5'):    
    normalized_df=(result-result.mean())/(((result-result.mean()).abs()).max())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n5.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n5a - positional normalization in range <-1,1> ((x-median)/max(abs(x-median)))
if (normalizationOperation == 'n5a'):    
    normalized_df=(result-result.median())/(((result-result.median()).abs()).max())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n5a.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n6 - quotient transformation (x/sd)
if (normalizationOperation == 'n6'):    
    normalized_df=(result)/(result.std())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n6.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n6a - positional quotient transformation (x/mad)
if (normalizationOperation == 'n6a'):    
    normalized_df=(result)/(result.mad())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n6a.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n7 - quotient transformation (x/range)
if (normalizationOperation == 'n7'):    
    normalized_df=(result)/(result.max()-result.min())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n7.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n8 - quotient transformation (x/max)
if (normalizationOperation == 'n8'):    
    normalized_df=(result)/(result.max())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n8.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n9 - quotient transformation (x/mean)
if (normalizationOperation == 'n9'):    
    normalized_df=(result)/(result.mean())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n9.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n9a - positional quotient transformation (x/median)
if (normalizationOperation == 'n9a'):    
    normalized_df=(result)/(result.median())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n9a.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n10 - quotient transformation (x/sum)
if (normalizationOperation == 'n10'):    
    normalized_df=(result)/(result.sum())
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n10.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n11 - quotient transformation (x/sqrt(SSQ))
#if (normalizationOperation == 'n11'):    
#    normalized_df=(result)/(result.max()-result.min())
#    result = pd.DataFrame(normalized_df)
#    result.to_csv('%s/Extraction/%s_%s_n11.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n12 - normalization ((x-mean)/sqrt(sum((x-mean)^2)))
if (normalizationOperation == 'n12'):    
    normalized_df=(result-result.mean())/(((result-result.mean()) ** 2).sum()).apply(np.sqrt)
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n12.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n12a - positional normalization ((x-median)/sqrt(sum((x-median)^2)))
if (normalizationOperation == 'n12a'):    
    normalized_df=(result-result.median())/(((result-result.median()) ** 2).sum()).apply(np.sqrt)
    result = pd.DataFrame(normalized_df)
    result.to_csv('%s/Extraction/%s_%s_n12a.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

# n13 - normalization with zero being the central point ((x-midrange)/(range/2))
#if (normalizationOperation == 'n13'):    
#    normalized_df=(result-result.range())/(result.range()/2)
#    result = pd.DataFrame(normalized_df)
#    result.to_csv('%s/Extraction/%s_%s_n13.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')


    
    
    
#    x = result.values #returns a numpy array
#    min_max_scaler = preprocessing.MinMaxScaler()
#    x_scaled = min_max_scaler.fit_transform(x[:,4:])
#    result = pd.DataFrame(x_scaled)
#    result.to_csv('%s/Extraction/%s_%s_NormMinMax.csv' % (mainPath, currentFile[:-4], groupingOperation), delimiter=',')

print("--- %s seconds ---" % (time.time() - start_time))
print("")
print("#### PROCESSED CSV GENERATED ####")


