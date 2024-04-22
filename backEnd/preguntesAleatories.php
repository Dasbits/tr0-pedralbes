<?php
session_start();
$dadesBack = file_get_contents('dadesBE.json');
$dadesBackEnd = json_decode($dadesBack);
$_SESSION['respostesCorr'] = [];

$pregsRand = [];

while (count($pregsRand) != 10) { 
    $nR = rand(0,count($dadesBackEnd)-1);
    if(!in_array($dadesBackEnd[$nR],$pregsRand)){
        $pregsRand[] = $dadesBackEnd[$nR];
    }
}

$respostesCorr = [];
for ($j = 0; $j < count($pregsRand); $j++) {
    
    $respostes = [];
    $f = 0;
    $posRand = rand(0,3);
    $respostesCorr[] = $posRand;
    for ($p=0; $p < 4; $p++) {
        if($p==$posRand){
            $respostes[] = $pregsRand[$j] -> resposta_correcta;
        } else {
            $respostes[] = $pregsRand[$j] -> respostes_incorrectes[$f];
            $f++;
        }
    }

    unset($pregsRand[$j] -> resposta_correcta);
    unset($pregsRand[$j] -> respostes_incorrectes);
    $pregsRand[$j] -> respostes = $respostes;


}

$_SESSION['respostesCorr'] = $respostesCorr;
$preguntes = json_encode($pregsRand);
echo $preguntes;