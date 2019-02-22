# -*- coding: utf-8 -*-

### TODO: 
###    Testar esse código para reordenar os features:
###        https://bl.ocks.org/matt-mcdaniel/267ba6445f61371012d7

###    Ao soltar o mouse calculo o ângulo de cada âncora a partir do centro,
###    pelo ângulo calculo a posição reordenada e a nova posição do feature

##################################################################################
### Distance and Correlation Matrix Construction from Extracted Audio Features ###
##################################################################################

import sys
import os
import numpy as np
#import matplotlib.pyplot as plt
import csv
from scipy.spatial.distance import euclidean
import scipy.cluster.hierarchy as sch
#from matplotlib import cm
#import scipy
from scipy.cluster.hierarchy import fcluster
import json
import uuid
import pandas as pd
from scipy.stats import kurtosis

#JSON resultante
result = {}

##################################################################################
### Carrega os dados do arquivo CSV fornecido e gera a matriz de distância.

### Input parameters (Test is just to development)
dirName = sys.argv[1]
csvFile = "/".join([dirName, "originalInput.csv"])
numberOfClusters= int(sys.argv[2])
orderMethod = int(sys.argv[3])
clusterOn = int(sys.argv[4])    
csvFileLabels = "/".join([dirName, "originalLabelsInput.csv"])
dbName = sys.argv[5]
filenameAsLabel = int(sys.argv[6])

### Registro os parametros de entrada no JSON
result['dirName'] = dirName
result['csvFile'] = csvFile
result['csvFileLabels'] = csvFileLabels
result['orderMethod'] = orderMethod
result['numberOfClusters'] = numberOfClusters
result['clusterOn'] = clusterOn
result['dbName'] = dbName
result['filenameAsLabel'] = filenameAsLabel

numberOfClusters = numberOfClusters+2
  
result['originalInput'] = csvFile
result['originalLabelsInput'] = csvFileLabels
  
### Load Feature Matrix
reader = csv.reader(open(csvFile, "rb"), delimiter=",")
csvData = list(reader)
  
### Get Feature Names
featureNameOriginal = csvData[0]
featureName = featureNameOriginal[4:] #erroindex
result['originalFeatureNames'] = featureName
 
### Get Feature Labels
#reader1 = csv.reader(open(csvFileLabels, "rb"), delimiter=",")
#featureLabels =  list(reader1)
 
#featureLabels = np.genfromtxt(csvFileLabels, delimiter=",")
 
# ### Distinct feature labels
# reader1 = csv.reader(open(csvFileLabels, "rb"), delimiter=",")
# csvDataLabels = list(reader1)
# featureLabels1 = np.asarray(csvDataLabels)
# featureLabels1 = featureLabels1[1:,:]
# output1 = []
# for x in featureLabels1[:,0]:
#     if int(x) not in output1:
#         output1.append(int(x))
# output2 = []
# for x in featureLabels1[:,1]:
#     if x not in output2:
#         output2.append(x)
# output3 = [0 for i in xrange(len(output2))]
# for x in range(len(output1)):
#     output3[output1[x]] = output2[x]
# result['dataLabels'] = output3

### Get Feature Labels
if (filenameAsLabel == 0):
    #featureLabels = np.genfromtxt(csvFileLabels, delimiter=",")
    #reader1 = csv.reader(open(csvFileLabels, "rb"), delimiter=",")
    #featureLabels =  list(reader1)
    
    ### Distinct feature labels
    reader1 = csv.reader(open(csvFileLabels, "rb"), delimiter=",")
    csvDataLabels = list(reader1)
    featureLabels1 = [[int(csvDataLabels[l][0]) for l in range(1,len(csvDataLabels))],[csvDataLabels[l][1] for l in range(1,len(csvDataLabels))]]    
    #featureLabels1 = np.asarray(csvDataLabels, dtype="string")
    #featureLabels1 = featureLabels1[1:,:]
    
    output1 = []
    for x in featureLabels1[0]:
        if x not in output1:
            output1.append(x)                
    
    output2 = []
    for x in featureLabels1[1]:
        if x not in output2:
            output2.append(x)

    result['dataLabels'] = output2
    
    featureLabels = [[0 for zz in range(len(featureLabels1[0]))],['none' for xx in range(len(featureLabels1[0]))]]
    for zz in range(len(featureLabels1[0])):
        for xx in range(len(output2)):            
            if featureLabels1[1][zz] == output2[xx]:
                featureLabels[0][zz] = xx
                featureLabels[1][zz] = output2[xx]
else:
    #Erase label file first 
    #os.system("rm -rf %s" % (result['originalLabelsInput']))

    #result['dataLabels'] = ['none']
    ### Distinct names as labels
    featureLabels1 = np.asarray(csvData)
    featureLabels1 = featureLabels1[1:,0]
    fnameIndex = 0
    output1 = []
    output2 = []
    for x in featureLabels1:
        if x not in output2:
            output1.append([fnameIndex, x])
            output2.append(x)
            fnameIndex = fnameIndex + 1
    result['dataLabels'] = output2

    featureLabels = [[0 for zz in range(len(featureLabels1))],['none' for xx in range(len(featureLabels1))]]
    for zz in range(len(featureLabels1)):
        for xx in range(len(output1)):            
            if featureLabels1[zz] == output1[xx][1]:                
                featureLabels[0][zz] = output1[xx][0]
                featureLabels[1][zz] = output1[xx][1]

### Get Feature Data
featureDataOriginal = np.genfromtxt(csvFile, delimiter=",")
featureData = featureDataOriginal[1:,4:] #erroindex
featureData = np.column_stack((featureData, featureLabels[0]))
#featureData = np.column_stack((featureData, featureLabels[1:,1]))
 
#############################################################################################################################################
### Este código é usado para substituir os LABELS criados no label maker
#############################################################################################################################################
featureDataOriginalDF = pd.read_csv(csvFile)
dfLabels = pd.DataFrame({'label': featureLabels[0]})
featureDataOriginalDFLabels = pd.concat([featureDataOriginalDF, dfLabels], axis=1)
featureDataOriginalDFLabels.to_csv("/".join([dirName, 'featureDataOriginal.csv']), sep=',', index=False)
result['locationFeatureDataOriginal'] = "/".join([dirName, 'featureDataOriginal.csv'])
  
### Compute the Distance Matrix
dist = np.zeros(shape=(len(featureName), len(featureName)))
for x in range(len(featureName)):
    for y in range(len(featureName)):
        dist[x,y] = euclidean(featureData[:,x], featureData[:,y])
   
### Save the original distance matrix
with open("/".join([dirName, 'distMatrixOriginal.csv']), 'wb') as matrix:
    for row in dist:
        spamwriter = csv.writer(matrix, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
result['locationDistMatrixOriginal'] = "/".join([dirName, 'distMatrixOriginal.csv'])
 
with open("/".join([dirName, 'distMatrixOriginal_2.csv']), 'wb') as matrix:
    spamwriter = csv.writer(matrix, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    spamwriter.writerow(featureName)
    for row in dist:
        spamwriter.writerow(row)
result['locationDistMatrixOriginal_2'] = "/".join([dirName, 'distMatrixOriginal_2.csv'])
 
### Matriz de distância (similaridade) ordenada.
m = ['single', 'complete', 'average', 'weighted', 'centroid', 'median', 'ward']
distMatrix = sch.linkage(dist, method=m[orderMethod])
Z1 = sch.dendrogram(distMatrix, no_plot=True)
featureNameOrderedID = Z1['leaves']
featureNameOrdered = []
for j in featureNameOrderedID:
    featureNameOrdered.append(featureName[j])
   
### Save the reordered feature IDs
result['orderedDistanceMatrixFeaturesID'] = featureNameOrderedID
result['orderedDistanceMatrixFeaturesNames'] = featureNameOrdered
   
### Reorder the oridinal dist matrix
distOrdered = dist[featureNameOrderedID,:]
distOrdered = distOrdered[:,featureNameOrderedID]
   
### Save the ordered distance matrix
with open("/".join([dirName, 'distMatrixOrdered.csv']), 'wb') as matrix:
    spamwriter = csv.writer(matrix, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for row in distOrdered:
        #spamwriter = csv.writer(matrix, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
result['locationDistMatrixOrdered'] = "/".join([dirName, 'distMatrixOrdered.csv'])
 
with open("/".join([dirName, 'distMatrixOrdered_2.csv']), 'wb') as matrix:
    spamwriter = csv.writer(matrix, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    spamwriter.writerow(featureNameOrdered)
    for row in distOrdered:
        spamwriter.writerow(row)
result['locationDistMatrixOrdered_2'] = "/".join([dirName, 'distMatrixOrdered_2.csv'])
 
### Calculate the correlation matrix
cMatrix = np.corrcoef(dist) #(Pearson product-moment correlation coefficients)
   
### Create a dendrogram to cluster features
corrMatrix = sch.linkage(cMatrix, method=m[orderMethod])    
Z1 = sch.dendrogram(corrMatrix, no_plot=True)    
  
### Order the features ID and names
featureNameOrderedID = Z1['leaves']
featureNameOrdered = []
for j in featureNameOrderedID:
    featureNameOrdered.append(featureName[j])
   
##Save the reordered feature IDs
result['orderedCorrelationMatrixFeaturesID'] = featureNameOrderedID
result['orderedCorrelationMatrixFeaturesNames'] = featureNameOrdered
   
### Reorder the correlation matrix
corrOrdered = cMatrix[featureNameOrderedID,:]
corrOrdered = corrOrdered[:,featureNameOrderedID]
   
### Save the ordered correlation matrix
with open("/".join([dirName, 'corrMatrixOrdered.csv']), 'wb') as matrix:
    for row in corrOrdered:
        spamwriter = csv.writer(matrix, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
result['locationCorrMatrixOrdered'] = "/".join([dirName, 'corrMatrixOrdered.csv'])
 
with open("/".join([dirName, 'corrMatrixOrdered_2.csv']), 'wb') as matrix:
    spamwriter = csv.writer(matrix, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    spamwriter.writerow(featureNameOrdered)
    for row in corrOrdered:
        spamwriter.writerow(row)
result['locationCorrMatrixOrdered_2'] = "/".join([dirName, 'corrMatrixOrdered_2.csv'])
 
### Dado um número de clusters classificar os features em grupos.
clusterObj = numberOfClusters
clusterDet = 10000
max_d = 0
while clusterDet > clusterObj:
    max_d = max_d + 1
    clusters = fcluster(distMatrix, max_d, criterion='distance')
    clusterDet = len( range(1, clusters.max()+1 ) )
   
clusters = fcluster(distMatrix, max_d, criterion='distance')
   
### Converto para um formato "JSONifyable"
clustersList = []
for i in clusters:
    clustersList.append(int(i))
result['clusters'] = clustersList
  
clustersOrdered = []
ids = result['orderedDistanceMatrixFeaturesID']
for x in range(len(ids)):
    clustersOrdered.append(clustersList[ids[x]])
result['clustersOrdered'] = clustersOrdered
  
### O mesmo para a correlalçao
clusterObj1 = numberOfClusters
clusterDet1 = 10000
max_d1 = 0
while clusterDet1 > clusterObj1:
    max_d1 = max_d1 + 1
    clusters1 = fcluster(corrMatrix, max_d1, criterion='distance')
    clusterDet1 = len( range(1, clusters1.max()+1 ) )
   
clusters1 = fcluster(corrMatrix, max_d1, criterion='distance')
  
### Converto para um formato "JSONifyable"
clustersList1 = []
for i in clusters1:
    clustersList1.append(int(i))
result['clustersC'] = clustersList1
  
clustersOrdered1 = []
ids = result['orderedCorrelationMatrixFeaturesID']
for x in range(len(ids)):
    clustersOrdered1.append(clustersList1[ids[x]])
result['clustersCOrdered'] = clustersOrdered1
  
### Algoritmo de seleção dos primeiros features de cada cluster 
# Distance
check = 0
featSelDist = []
featSelDistC = []
bestKurtosis = 1000
bestKurtosisID = {}
i = 0
for val in clustersOrdered:
    if val != check:        
        check = val
        bestKurtosis = 1000
        
    featureKurtosis = np.abs(kurtosis(featureData[:,result['orderedDistanceMatrixFeaturesID'][i]]));        
    if (featureKurtosis < bestKurtosis):
        bestKurtosis = featureKurtosis
        bestKurtosisID[check] = result['orderedDistanceMatrixFeaturesID'][i]

    i = i+1
    
for k in range(1,len(bestKurtosisID)+1):
    featSelDist.append( bestKurtosisID[k] )
    featSelDistC.append( clustersList[bestKurtosisID[k]] )
result['featSelDist'] = featSelDist

# Correlation
check = 0
featSelCorr = []
featSelCorrC = []
bestKurtosis = 1000
bestKurtosisID = {}
i = 0
for val in clustersOrdered1:      
    if val != check:
        check = val
        bestKurtosis = 1000

    featureKurtosis = np.abs(kurtosis(featureData[:,result['orderedCorrelationMatrixFeaturesID'][i]]))
    if (featureKurtosis < bestKurtosis):
        bestKurtosis = featureKurtosis
        bestKurtosisID[check] = result['orderedCorrelationMatrixFeaturesID'][i]            

    i = i+1

for k in range(1,len(bestKurtosisID)+1):
    featSelCorr.append( bestKurtosisID[k] )
    featSelCorrC.append( clustersList1[bestKurtosisID[k]] )
result['featSelCorr'] = featSelCorr

#Export results in JSON format
json_result = json.dumps(result)
with open("/".join([dirName, 'data.json']), 'w') as outfile:
    json.dump(result, outfile)
print(json_result)

# # Distance
# check = 0
# featSelDist = []
# i = 0
# for val in clustersOrdered:
#     if val != check:
#         check = val
#         featSelDist.append( result['orderedDistanceMatrixFeaturesID'][i] )
#     i = i+1
# result['featSelDist'] = featSelDist
#  
# # Correlation
# check = 0
# featSelCorr = []
# i = 0
# for val in clustersOrdered1:
#     if val != check:
#         check = val
#         featSelCorr.append( result['orderedCorrelationMatrixFeaturesID'][i] )
#     i = i+1
# result['featSelCorr'] = featSelCorr

