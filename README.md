# IV2018 - A Visualization Framework for Feature Investigation in Soundscape Recordings

Studies in soundscape ecology can generate large volumes of audio recordings collected over extensive time intervals. Extracting information from such data is challenging and time demanding. Important tasks, in this context, are to identify occurrences of acoustic events of interest and find out which combination of audio features are suitable for characterizing specific events or describing a particular soundscape. Researchers in soundscape ecology have been investigating approaches to accomplish such tasks effectively, and there is a demand for tools capable of assisting analysts in investigating large databases of ecological recordings. In this paper we describe a visualiza-tion framework for this purpose. The system includes multiple functionalities for soundscape analysis, comprising audio feature extraction, identification of relevant acoustic events by means of visualizations associated with audio playbacks, and event characterization by means of subspace feature analysis, also assisted by visualizations. The system implements a user-driven iterative pipeline that gives domain experts means to search for, identify and characterize acoustic events, gathering insight on which features better describe them and their originating soundscape.

## Authors:
   Clausius Duque G. Reis (UFV/USP-SC) - clausiusreis@gmail.com\
   Thalisson Nobre Santos (USP-SC)\
   Maria Cristina Ferreira de Oliveira (USP-SC)
       
## Citation
Research published about the content of this framework:

[A Visualization Framework for Feature Investigation in Soundscape Recordings](https://www.researchgate.net/publication/327390554_A_Visualization_Framework_for_Feature_Investigation_in_Soundscape_Recordings) (September 2018)

## Installation procedures
Copy the content of IV2018-INSTALL (IV2018, SMARTY and FILES) to an Apache+PHP server of your choice.

On [IV2018/DOCS/setup/SETUP.sh](https://github.com/clausiusreis/IV2018/blob/master/IV2018/DOCS/setup/SETUP.sh) can be found a script to help with the setup process of the libraries. The framework was designed to work on a Linux Mint 19.1 Cinnamon machine with an Apache+PHP server. 

Some directories need special access permissions, the script [IV2018/IV2018/DOCS/setup/permissions.sh](https://github.com/clausiusreis/IV2018/blob/master/IV2018/DOCS/setup/permissions.sh) set the file permissions dinamically given the path where the IV2018, SMARTY and FILES were copied as input.

## Financial support 
CAPES, CNPq (301847/2017-7) and FAPESP (2017/05838-3)

## Acknowledgment
We like to acknowledge the financial support of the Coordination for the Improvement of Higher Education Personnel (CAPES), São Paulo State Research Foundation (FAPESP grants 2017/05838-3 and the National Council for Scientific and Technological Development (CNPq grant 301847/2017-7). The views expressed do not reflect the official policy or position of either CAPES, FAPESP or CNPq.
