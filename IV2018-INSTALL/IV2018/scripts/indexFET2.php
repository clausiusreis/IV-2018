<?php
    // Feature Extraction Tool (WEB)

    $featArray = ["ACI","ADI","AEI","BIO","MFCC","NDSI","RMS","TH","ZCR","SpecMean","SpecSD",
        "SpecSEM","SpecMedian","SpecMode","SpecQuartile","SpecSkewness",
        "SpecKurtosis","SpecEntropy","SpecVariance","SpecChromaSTFT",
        "SpecChromaCQT","SpecCentroid","SpecBandwidth","SpecContrast",
        "SpecRolloff","SpecPolyFeat","SpecSpread","SPL"];
    
    if (isset($_REQUEST['action'])) {
        $action = $_REQUEST['action'];
                
        $json['GENERAL_mainPath'] = "../../FILES/FET/".$_REQUEST['GENERAL_mainPath'];                
        $json['GENERAL_fileDateTimeMask'] = $_REQUEST['GENERAL_fileDateTimeMask'];
        $json['GENERAL_audioChannel'] = (int)$_REQUEST['GENERAL_audioChannel'];
        $json['GENERAL_timeWindow'] = (int)$_REQUEST['GENERAL_timeWindow'];
        $json['GENERAL_groupingOperation'] = $_REQUEST['GENERAL_groupingOperation'];
        $json['GENERAL_normalizationOperation'] = $_REQUEST['GENERAL_normalizationOperation'];
        $json['GENERAL_removeOutliers'] = $_REQUEST['GENERAL_removeOutliers'];
        $json['GENERAL_dbThreshold'] = (int)$_REQUEST['GENERAL_dbThreshold'];
        $featuresSelected = [];
        foreach ($featArray as $value) {
            if (isset($_REQUEST['enable'.$value])) {
                array_push($featuresSelected, $value);
            }
            $json['GENERAL_featuresToCalculate'] = $featuresSelected;
        }
        
        $json['ACI_min_freq'] = (int)$_REQUEST['ACI_min_freq'];
        $json['ACI_max_freq'] = (int)$_REQUEST['ACI_max_freq'];
        $json['ACI_j_bin'] = (int)$_REQUEST['ACI_j_bin'];
        $json['ACI_fft_w'] = (int)$_REQUEST['ACI_fft_w'];     
        
        $json['ADI_max_freq'] = (int)$_REQUEST['ADI_max_freq'];
        $json['ADI_freq_step'] = (int)$_REQUEST['ADI_freq_step'];
        $json['ADI_fft_w'] = (int)$_REQUEST['ADI_fft_w'];

        $json['AEI_max_freq'] = (int)$_REQUEST['AEI_max_freq'];
        $json['AEI_freq_step'] = (int)$_REQUEST['AEI_freq_step'];
        $json['AEI_fft_w'] = (int)$_REQUEST['AEI_fft_w'];
        
        $json['BIO_min_freq'] = (int)$_REQUEST['BIO_min_freq'];
        $json['BIO_max_freq'] = (int)$_REQUEST['BIO_max_freq'];
        $json['BIO_fft_w'] = (int)$_REQUEST['BIO_fft_w'];
        
        $json['MFCC_numcep'] = (int)$_REQUEST['MFCC_numcep'];
        $json['MFCC_min_freq'] = (int)$_REQUEST['MFCC_min_freq'];
        $json['MFCC_max_freq'] = (int)$_REQUEST['MFCC_max_freq'];
        $json['MFCC_useMel'] = $_REQUEST['MFCC_useMel'];
        
        $json['NDSI_fft_w'] = (int)$_REQUEST['NDSI_fft_w'];
        $json['NDSI_anthrophony'] = [(int)$_REQUEST['NDSI_anthrophony_min'], (int)$_REQUEST['NDSI_anthrophony_max']];
        $json['NDSI_biophony'] = [(int)$_REQUEST['NDSI_biophony_min'], (int)$_REQUEST['NDSI_biophony_max']];
        
        $json['SpecSpread_fft_w'] = (int)$_REQUEST['SpecSpread_fft_w'];
        
        $json['SpecMean_min_freq'] = (int)$_REQUEST['SpecMean_min_freq'];
        $json['SpecMean_max_freq'] = (int)$_REQUEST['SpecMean_max_freq'];
        $json['SpecMean_fft_w'] = (int)$_REQUEST['SpecMean_fft_w'];
        
        $json['SpecSD_min_freq'] = (int)$_REQUEST['SpecSD_min_freq'];
        $json['SpecSD_max_freq'] = (int)$_REQUEST['SpecSD_max_freq'];
        $json['SpecSD_fft_w'] = (int)$_REQUEST['SpecSD_fft_w'];
        
        $json['SpecSEM_min_freq'] = (int)$_REQUEST['SpecSEM_min_freq'];
        $json['SpecSEM_max_freq'] = (int)$_REQUEST['SpecSEM_max_freq'];
        $json['SpecSEM_fft_w'] = (int)$_REQUEST['SpecSEM_fft_w'];
        
        $json['SpecMedian_min_freq'] = (int)$_REQUEST['SpecMedian_min_freq'];
        $json['SpecMedian_max_freq'] = (int)$_REQUEST['SpecMedian_max_freq'];
        $json['SpecMedian_fft_w'] = (int)$_REQUEST['SpecMedian_fft_w'];
        
        $json['SpecMode_min_freq'] = (int)$_REQUEST['SpecMode_min_freq'];
        $json['SpecMode_max_freq'] = (int)$_REQUEST['SpecMode_max_freq'];
        $json['SpecMode_fft_w'] = (int)$_REQUEST['SpecMode_fft_w'];
        
        $json['SpecQuartile_min_freq'] = (int)$_REQUEST['SpecQuartile_min_freq'];
        $json['SpecQuartile_max_freq'] = (int)$_REQUEST['SpecQuartile_max_freq'];
        $json['SpecQuartile_fft_w'] = (int)$_REQUEST['SpecQuartile_fft_w'];
        
        $json['SpecSkewness_min_freq'] = (int)$_REQUEST['SpecSkewness_min_freq'];
        $json['SpecSkewness_max_freq'] = (int)$_REQUEST['SpecSkewness_max_freq'];
        $json['SpecSkewness_fft_w'] = (int)$_REQUEST['SpecSkewness_fft_w'];
        $json['SpecSkewness_power'] = $_REQUEST['SpecSkewness_power'];
        
        $json['SpecKurtosis_min_freq'] = (int)$_REQUEST['SpecKurtosis_min_freq'];
        $json['SpecKurtosis_max_freq'] = (int)$_REQUEST['SpecKurtosis_max_freq'];
        $json['SpecKurtosis_fft_w'] = (int)$_REQUEST['SpecKurtosis_fft_w'];
        $json['SpecKurtosis_power'] = $_REQUEST['SpecKurtosis_power'];
        
        $json['SpecEntropy_min_freq'] = (int)$_REQUEST['SpecEntropy_min_freq'];
        $json['SpecEntropy_max_freq'] = (int)$_REQUEST['SpecEntropy_max_freq'];
        $json['SpecEntropy_fft_w'] = (int)$_REQUEST['SpecEntropy_fft_w'];
        $json['SpecEntropy_power'] = $_REQUEST['SpecEntropy_power'];
        
        $json['SpecVariance_min_freq'] = (int)$_REQUEST['SpecVariance_min_freq'];
        $json['SpecVariance_max_freq'] = (int)$_REQUEST['SpecVariance_max_freq'];
        $json['SpecVariance_fft_w'] = (int)$_REQUEST['SpecVariance_fft_w'];
        $json['SpecVariance_power'] = $_REQUEST['SpecVariance_power'];
        
        $json['SpecChromaSTFT_min_freq'] = (int)$_REQUEST['SpecChromaSTFT_min_freq'];
        $json['SpecChromaSTFT_max_freq'] = (int)$_REQUEST['SpecChromaSTFT_max_freq'];
        $json['SpecChromaSTFT_fft_w'] = (int)$_REQUEST['SpecChromaSTFT_fft_w'];
        $json['SpecChromaSTFT_power'] = $_REQUEST['SpecChromaSTFT_power'];
        
        $json['SpecCentroid_fft_w'] = (int)$_REQUEST['SpecCentroid_fft_w'];
        
        $json['SpecBandwidth_fft_w'] = (int)$_REQUEST['SpecBandwidth_fft_w'];
        
        $json['SpecContrast_fft_w'] = (int)$_REQUEST['SpecContrast_fft_w'];
        
        $json['SpecRolloff_fft_w'] = (int)$_REQUEST['SpecRolloff_fft_w'];
        
        $json['SpecPolyFeat_min_freq'] = (int)$_REQUEST['SpecPolyFeat_min_freq'];
        $json['SpecPolyFeat_max_freq'] = (int)$_REQUEST['SpecPolyFeat_max_freq'];
        $json['SpecPolyFeat_fft_w'] = (int)$_REQUEST['SpecPolyFeat_fft_w'];
        $json['SpecPolyFeat_power'] = $_REQUEST['SpecPolyFeat_power'];
        
        $json['SPL_min_freq'] = (int)$_REQUEST['SPL_min_freq'];
        $json['SPL_max_freq'] = (int)$_REQUEST['SPL_max_freq'];
        $json['SPL_fft_w'] = (int)$_REQUEST['SPL_fft_w'];
        
        //Generate JSON file
        if (!file_exists($json['GENERAL_mainPath'].'/Extraction')) {
            mkdir($json['GENERAL_mainPath'].'/Extraction', 0755, true);
        }
        $fp = fopen($json['GENERAL_mainPath'].'/Extraction/parameters.json', 'w');
        fwrite($fp, json_encode($json));
        fclose($fp);
        
        $dbname = $json['GENERAL_mainPath'];
        shell_exec("python ./Python/SoundscapeVICG_FeaturesExtraction.py $dbname");        
        
    };

?>