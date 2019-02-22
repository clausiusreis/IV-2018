<?php

class soundscape {

    function soundscape() {}

    function extractSpectrograms(
            $audioChannel=0, 
            $cmap='hot', 
            $wNFFT=2048, 
            $inputPath="", 
            $wALL=10000, 
            $topDB=50,
            $linear='linear'){

            shell_exec('python ./Python/SoundscapeVICG_SpectrogramLoopExtractor.py '
                . $audioChannel . ' '
                . $cmap . ' ' 
                . $wNFFT . ' '
                . $inputPath . ' '
                . $inputPath . '/Extraction/AudioSpectrogram '
                . $wALL . ' '
                . $topDB . ' '
                . $linear . '');
    }

    function extractNMF(
            $n_fft = 1024,
            $n_components = 10,
            $alpha=1.0,
            $l1_ratio=0.0,
            $inputPath = ""){ #Sem barra no final

            shell_exec('python ./Python/SoundscapeVICG_NMFLoop_RainAmplitude.py '
                . $n_fft . ' '
                . $n_components . ' ' 
                . $alpha . ' '
                . $l1_ratio . ' '
                . $inputPath);
    }

    function extractFeatures($inputPath = "", $resultingName = "Features") { #Sem barra no final        
        //Extract the features
    	shell_exec('python ./Python/SoundscapeVICG_FeaturesLoopExtractor.py ' . $inputPath);
    	
        //Group them into a single CSV file
        shell_exec('python ./Python/SoundscapeVICG_UnifiedCSVGenerator.py ' . $inputPath . ' ' . $resultingName);         
      
        shell_exec('python ./Python/SoundscapeVICG_UnifiedCSVManipulator.py ' . $inputPath. ' ' . $resultingName . '.csv none n4');
    }

}
?>