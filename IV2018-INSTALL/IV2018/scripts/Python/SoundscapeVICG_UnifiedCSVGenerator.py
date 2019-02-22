#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import csv
import sys

################################################################################
### PROGRAMA PRINCIPAL #########################################################
################################################################################
#Just for testing performance
import time
start_time = time.time()

# Directory where the audio files are stored
mainPath = sys.argv[1]
#mainPath = '/home/clausius/Documents/DOUTORADO/TEST_DATABASE/TEST1'

resultingCSVName = sys.argv[2]
#resultingCSVName = 'Features'

#fileOperation = sys.argv[3]
#fileOperation = 'mean'


wdir = os.listdir("%s/Extraction/AudioFeatures" % (mainPath))
wdir.sort()
csvFiles = [arq for arq in wdir if (arq.lower().endswith(".csv"))]
csvFiles.sort()

print("#### GENERATING UNIFIED CSV ####")
print("")
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
                else:
                    if (currentLine > 0):
                        csvwriter.writerow(row)
                    currentLine = currentLine + 1


print("--- %s seconds ---" % (time.time() - start_time))
print("")
print("#### UNIFIED CSV GENERATED ####")


