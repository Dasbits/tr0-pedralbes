<?php
session_start();
//Obtenim les respostes rebudes
$data=$_POST['dades'];
$dades_rebudes=json_decode($data);


$correctes = 0;
$incorrectes = 10;

for ($i = 0; $i < count($dades_rebudes); $i++) {

  if(
    $_SESSION['respostesCorr'] [ $dades_rebudes[$i] -> pregunta ] == $dades_rebudes[$i] -> resposta
    ){
      $correctes++;
      $incorrectes--;
  }
}

$respostes = array('correctes' => $correctes, 'incorrectes' => $incorrectes);

echo json_encode($respostes);
?>