#!/bin/bash

###########################################################################################################
### Installation Procedures ###############################################################################
###########################################################################################################

# Run this script as super-user

### Install Python and python-libraries;
yes | apt-get install python-pip;
yes | apt-get install python-numpy; 
yes | apt-get install python-matplotlib ;
yes | apt-get install python-skimage;
yes | pip install scipy==1.2.0;
yes | pip install sklearn;
yes | pip install Pillow==5.4.1;

### Install Python web server (Flask)
yes | pip install setuptools;
yes | pip install Flask==1.0.2;

#---Audio loader and manipulation libraries--------------------------
yes | apt-get install python-dev;
#yes | pip install librosa;
#yes | apt-get install flac;
yes | apt-get install python-tk;
yes | apt-get install python-pandas;

yes | apt-get install libsndfile1;
yes | apt-get install libsndfile1-dev;
yes | apt-get install ffmpeg;
yes | apt-get install python-setuptools;
yes | apt-get install python-dev;
yes | apt-get install flac;
yes | pip install librosa==0.6.2;
yes | pip install pysoundfile==0.9.0.post1;
