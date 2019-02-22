#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import csv
import numpy as np
import pandas as pd
#from sklearn import preprocessing

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
        variance = auxsumsq / l - mean * mean;
        sd = np.sqrt(variance);
        
        for i in range(0, l):
            if ( (data[data.columns[j]][i] > (mean + 3 * sd)) | (data[data.columns[j]][i] < (mean - 3 * sd)) ):
                data[data.columns[j]][i] = mean;

    return data;

def unifyCSV(mainPath, 
             resultingCSVName="features", 
             groupingOperation="none", 
             normalizationOperation="n4",
             removeOutliers = False):
    #mainPath: Directory where the audio files are stored
    #resultingCSVName: Name of the resulting CSV file
    #groupingOperation: Operation over each file - none, mean, median
    #normalizationOperation: type of normalization: 
    #    n0 - without normalization
    #    n1 - standardization ((x-mean)/sd)
    #    n2 - positional standardization ((x-median)/mad)
    #    n3 - unitization ((x-mean)/range)
    #    n3a - positional unitization ((x-median)/range)
    #    n4 - unitization with zero minimum ((x-min)/range)
    #    n5 - normalization in range <-1,1> ((x-mean)/max(abs(x-mean)))
    #    n5a - positional normalization in range <-1,1> ((x-median)/max(abs(x-median)))
    #    n6 - quotient transformation (x/sd)
    #    n6a - positional quotient transformation (x/mad)
    #    n7 - quotient transformation (x/range)
    #    n8 - quotient transformation (x/max)
    #    n9 - quotient transformation (x/mean)
    #    n9a - positional quotient transformation (x/median)
    #    n10 - quotient transformation (x/sum)
    #    n12 - normalization ((x-mean)/sqrt(sum((x-mean)^2)))
    #    n12a - positional normalization ((x-median)/sqrt(sum((x-median)^2)))
    
    wdir = os.listdir("%s/Extraction/AudioFeatures" % (mainPath))
    wdir.sort()
    csvFiles = [arq for arq in wdir if (arq.lower().endswith(".csv"))]
    csvFiles.sort()
    
    print("#### GENERATING UNIFIED CSV ####")
    print "Processing directory: %s" % mainPath
    
    firstHeader = 0
    resultingFile = '%s/Extraction/%s.csv' % (mainPath, resultingCSVName)
    with open(resultingFile, 'wb') as outputCsvfile:
        csvwriter = csv.writer(outputCsvfile, delimiter=',')
    
        for f in csvFiles:
            print "   Processing file: %s" % f
            with open("%s/Extraction/AudioFeatures/%s" % (mainPath, f), 'rb') as ff:
                reader = csv.reader(ff)
    
                currentLine = 0
                for row in reader:
                    if (firstHeader == 0):
                        csvwriter.writerow(row)
                        firstHeader = 1
                        currentLine = currentLine + 1
                    else:
                        if (currentLine > 0):
                            csvwriter.writerow(row)
                        currentLine = currentLine + 1

    print("#### UNIFIED CSV GENERATED ####")

    print("#### NORMALIZING CSV ####")
    print "Processing file: %s" % (resultingFile)
    
    #load original CSV
    df = pd.read_csv(resultingFile)
    
    ### DATA GROUPING ###################################################################################
    if (groupingOperation == "mean"):
        result = df.groupby(['FileName', 'Date', 'Time']).mean()
        result = pd.DataFrame(result)
        result.to_csv('%s_group.csv' % (resultingFile[:-4]), sep=',')

        if (result.shape[0] == 0):        
            result = df.groupby(['FileName']).mean()
            result = pd.DataFrame(result)
            result.to_csv('%s_group.csv' % (resultingFile[:-4]), sep=',')
    
    if (groupingOperation == "median"):
        result = df.groupby(['FileName', 'Date', 'Time']).median()
        result = pd.DataFrame(result)
        result.to_csv('%s_group.csv' % (resultingFile[:-4]), sep=',')
        
        if (result.shape[0] == 0):
            result = df.groupby(['FileName']).median()
            result = pd.DataFrame(result)
            result.to_csv('%s_group.csv' % (resultingFile[:-4]), sep=',')
    
    if (groupingOperation == "none"):
        result = df.groupby(['FileName', 'Date', 'Time', 'SecondsFromStart']).mean()
        result = pd.DataFrame(result)
        result.to_csv('%s_group.csv' % (resultingFile[:-4]), sep=',')
        
        if (result.shape[0] == 0):
            result = df.groupby(['FileName', 'SecondsFromStart']).mean()
            result = pd.DataFrame(result)
            result.to_csv('%s_group.csv' % (resultingFile[:-4]), sep=',')

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
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n2 - positional standardization ((x-median)/mad)
    if (normalizationOperation == 'n2'):
        normalized_df=(result-result.median())/(result.mad())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
        
    # n3 - unitization ((x-mean)/range)
    if (normalizationOperation == 'n3'):    
        normalized_df=(result-result.mean())/(result.max()-result.min())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n3a - positional unitization ((x-median)/range)
    if (normalizationOperation == 'n3a'):    
        normalized_df=(result-result.median())/(result.max()-result.min())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n4 - unitization with zero minimum ((x-min)/range)
    if (normalizationOperation == 'n4'):    
        normalized_df=(result-result.min())/(result.max()-result.min())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n5 - normalization in range <-1,1> ((x-mean)/max(abs(x-mean)))
    if (normalizationOperation == 'n5'):    
        normalized_df=(result-result.mean())/(((result-result.mean()).abs()).max())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n5a - positional normalization in range <-1,1> ((x-median)/max(abs(x-median)))
    if (normalizationOperation == 'n5a'):    
        normalized_df=(result-result.median())/(((result-result.median()).abs()).max())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n6 - quotient transformation (x/sd)
    if (normalizationOperation == 'n6'):    
        normalized_df=(result)/(result.std())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n6a - positional quotient transformation (x/mad)
    if (normalizationOperation == 'n6a'):    
        normalized_df=(result)/(result.mad())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n7 - quotient transformation (x/range)
    if (normalizationOperation == 'n7'):    
        normalized_df=(result)/(result.max()-result.min())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n8 - quotient transformation (x/max)
    if (normalizationOperation == 'n8'):    
        normalized_df=(result)/(result.max())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n9 - quotient transformation (x/mean)
    if (normalizationOperation == 'n9'):    
        normalized_df=(result)/(result.mean())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n9a - positional quotient transformation (x/median)
    if (normalizationOperation == 'n9a'):    
        normalized_df=(result)/(result.median())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n10 - quotient transformation (x/sum)
    if (normalizationOperation == 'n10'):    
        normalized_df=(result)/(result.sum())
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
        
    # n12 - normalization ((x-mean)/sqrt(sum((x-mean)^2)))
    if (normalizationOperation == 'n12'):    
        normalized_df=(result-result.mean())/(((result-result.mean()) ** 2).sum()).apply(np.sqrt)
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
    
    # n12a - positional normalization ((x-median)/sqrt(sum((x-median)^2)))
    if (normalizationOperation == 'n12a'):    
        normalized_df=(result-result.median())/(((result-result.median()) ** 2).sum()).apply(np.sqrt)
        result = pd.DataFrame(normalized_df)
        result.to_csv('%s_norm.csv' % (resultingFile[:-4]), sep=',')
        
    print("#### PROCESSED CSV GENERATED ####")

