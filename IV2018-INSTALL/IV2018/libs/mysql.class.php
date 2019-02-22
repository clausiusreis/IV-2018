<?php
//   include_once("DB.php");
//#######################################################################################################
// class mysql {            -> Cria a CLASSE super, todos seus atributos
//                             e métodos são criados DINAMICAMENTE
//#######################################################################################################
// Autor: Clausius Duque Gonçalves Reis
class mysql {

   var $tabela;          // Nome da TABELA usada para saber o NOME das COLUNAS
   var $sql;             // A string SQL sendo executada no momento
   var $sql_padrao;      // Se não foi enviada nenhuma SQL, adota-se a padrão do sistema
                         //    ($sql_padrao = 1)
                         // Senão adota-se a SQL enviada
                         //    ($sql_padrao = 0)

   var $upload_feito;    // 1 - Upload já foi feito
                         // 0 - Upload ainda não foi feito

   var $load_feito;      // 1 - Load já foi feito
                         // 0 - Load ainda não foi feito

   var $erro_transacao;  // 1 - Ocorreu um erro durante as transações
                         // 0 - Não ocorreram erros durante as transações
   
   var $db;              // Conexão com banco de dados
                         
   var $key;             // Campo chave
   var $lastInsertID;    // ID do último insert
   
   var $mensagem;        // 1 - Mostrar mensagens
                         // 0 - Não mostrar mensagens
//#######################################################################################################

//#######################################################################################################
//    function super($db, $tabela) {   -> INSTANCIA o OBJETO, a partir
//                                        do nome da TABELA recebida
//                                        da CLASSE FILHA (CLASSE que esta
//                                        herdando a SUPER.CLASS.PHP)
//                                         $db     - Conexão ao Banco de Dados
//                                         $tabela - Variavel contendo o nome
//                                                   da TABELA que dará nome
//                                                   à CLASSE
      function mysql($db, $tabela) {   
         $this->db             = $db;        
         
         $this->tabela         = $tabela;  // Arquivo no objeto o nome da TABELA em uso

         $this->achaChave($db, $tabela);//Chama o metodo achaChave para preencher o campo Key

         $this->upload_feito   = 0;
         $this->load_feito     = 0;
         $this->mensagem       = 1;

         $this->lastInsertID   = 0;
         
         $dados = $this->tableInfo($db, $this->tabela); // Pego do BD as propriedades da TABELA em um ARRAY
                                                        //    [table] => Nome da TABELA
                                                        //    [name]  => Nome da COLUNA
                                                        //    [type]  => Tipo dos dados (int,string,time,date)
                                                        //    [len]   => Tamanho do campo
                                                        //    [flags] => Propriedades do campo (MySQL)
                                                        //               (not_null,
                                                        //                primary_key,
                                                        //                auto_increment)

         //$i = 0;
         foreach ($dados as $d) {
         //while ($dados[$i]['name'] <> '') {      // Percorro as COLUNAS da TABELA
            $nome_coluna = $d['name'];   // Pego o nome da COLUNA

            //TODO: Tratar os tipos de dados
            if (($d['type'] == 'int') OR
                ($d['type'] == 'real') OR
                ($d['type'] == 'bit')) {   // Verifico o TIPO da COLUNA
               $this->$nome_coluna = 0;            // Instancio um ATRIBUTO da CLASSE do tipo numérico
            } else {
               $this->$nome_coluna = '';           // Instancio um ATRIBUTO da CLASSE do tipo string
            }

            //$i++;
         }

      }
//#######################################################################################################



//#######################################################################################################
//    function upload($db, $array){  -> Efetua o lançamento dos dados do $array para o OBJETO
//                                         $db    - Conexão ao Banco de Dados
//                                         $array - $array contendo os valores
//                                                  que poderão vir de um $_POST
      function upload($db, $array){

         if (is_array($array)) {  // Verifica se é um ARRAY válido
            //$tab = $this->tabela;  // coloco o nome da TABELA em uma variável para usar em uma STRING

            $dados = $this->tableInfo($db, $this->tabela); // Pego do BD as propriedades da TABELA em um ARRAY
                                                    //    [table] => Nome da TABELA
                                                    //    [name]  => Nome da COLUNA
                                                    //    [type]  => Tipo dos dados (int,string,time,date)
                                                    //    [len]   => Tamanho do campo
                                                    //    [flags] => Propriedades do campo (MySQL)
                                                    //               (not_null,
                                                    //                primary_key,
                                                    //                auto_increment)

            $i = 0;
            foreach ($dados as $d) {
            //while ($dados[$i]['name'] <> '') {     // Percorro as COLUNAS da TABELA
               $nome_coluna = $d['name'];  // Pego o nome da COLUNA

               $this->$nome_coluna = $array["$nome_coluna"]; // Lanço os valores do ARRAY dentro do OBJETO

               $i++;
            }

            $this->upload_feito = 1;  // Informo que o UPLOAD foi feito
         } else {
            print_r('<center><h1>Para acessar o método upload(),<br>é necessário passar um ARRAY válido.</h1></center>');
         }
      }
//#######################################################################################################



//#######################################################################################################
//    function load($db, $id, $sql=""){  -> Efetua a carrega de um REGISTRO do Banco de
//                                          Dados para dentro do OBJETO instanciado
//                                             $db  - Conexão ao Banco de Dados
//                                             $id  - Chave primária do REGISTRO desejado
//                                             $sql - É passado por parâmetro, ficando
//                                                    OPCIONAL o seu uso. Se for passado,
//                                                    o mesmo é executado, independente do
//                                                    seu conteúdo
      function load($db, $id, $sql=""){

         $tab = $this->tabela;  // coloco o nome da TABELA em uma variável para usar em uma STRING

         if ($sql == "") {  // Se a SQL estiver vazia, uso uma SQL genérica (Todos os campos)

            $this->sql = sprintf("select * from  $tab where %s=%d",$this->key,$id);  // Monto a SQL genérica
            $this->sql_padrao = '1';  // Informo que não foi passada nenhuma SQL por parâmetro
         } else {  // Se a SQL não estiver vazia, executo a que foi passada por parâmetro

            $this->sql = sprintf("$sql",$id);  // Recebo no OBJETO a string SQL
            $this->sql_padrao = '0';  // Informo que estou utilizando uma SQL passada por parâmetro

         }

         $result = @mysqli_query($db, $this->sql);  // Executo a SQL

         $dados_consulta = $this->tableInfo($db, $tab);  // Recebo as informações sobre os campos
                                                             // da consulta SQL no OBJETO ($this->sql)
         $row = @mysqli_fetch_object($result);  // Recebo em $row os valores da consulta, em um ARRAY
                                                                                                                                   
         $i = 0;
         foreach ($dados_consulta as $d) {
         //while ($dados_consulta[$i]['name'] <> '') {  // Percorro as COLUNAS
            $nome_coluna = $d['name'];  // Pego o nome da COLUNA

            $this->$nome_coluna = $row->$nome_coluna;  // Lanço os valores da consulta dentro do OBJETO

            $i++;
         }

         $this->load_feito = 1;  // Informo que o LOAD foi feito
      }
//#######################################################################################################



//#######################################################################################################
      function getFields($db) {

         // if (($this->upload_feito == 1) OR ($this->load_feito == 1)) {
         //    Este método só será executado no caso do OBJETO possuir valores,
         //    ou seja deverá ter sido executado o método UPLOAD ou LOAD anteriormente.

         if (($this->upload_feito == 1) OR ($this->load_feito == 1)) {

            $wsql = $this->sql;  // Recebo em $wsql a SQL atual do OBJETO
            $tab = $this->tabela;  // Recebo em $tab o nome da tabela que estou trabalhando
                                   // Esta só usada se a SQL padrão estiver sendo utilizada

            // LOOP para se encontrar o nome dos CAMPOS da TABELA
            if ($this->sql_padrao == '0') {  // Verifico se a SQL padrão foi utilizada
               $query = sprintf("$wsql",-1);  // Executo a SQL com ID=-1, para receber apenas
                                              // os campos da TABELA, sem nenhum valor
               $result = @mysqli_query($db,$query);  // Executo a SQL
               $dados = $this->tableInfoResult($result); // Recebo as informações da TABELA em $dados

//               if(DB::isError($result)) {  // Verifico se a execução deu errado
//                  $_SESSION['erro_transacao'] = 1;
//               }

            } else {  // Se a SQL for a padrão

               $dados = $this->tableInfo($db, "$tab");  // Recebo as informações da TABELA em $dados
            }

            $i = 0;
            foreach ($dados as $d) {
            //while ($dados[$i]['name'] <> '') {  // Percorro as COLUNAS da TABELA
               $nome_coluna = $d['name'];  // Pego o nome da COLUNA

               $array["$nome_coluna"] = $this->$nome_coluna;  // Monto um ARRAY com o conteudo atual do OBJETO

               $i++;
            }

           return $array;  // Retorno esse ARRAY ao sistema

          } else {
            print_r('<center><h1>Para acessar o método getFields(),<br>é necessário carregar os dados no objeto.</h1></center>');
          }
      }
//#######################################################################################################



//#######################################################################################################
//    function getAllFields($db, $sql=""){     -> Carrego TODOS os REGISTROS do Banco de Dados
//                                                para dentro de um ARRAY.
//                                                   $db  - Conexão ao Banco de Dados
//                                                   $sql - É passado por parâmetro, ficando
//                                                          OPCIONAL o seu uso. Se for passado,
//                                                          o mesmo é executado, independente do
//                                                          seu conteúdo
//                                                          (RESPONSABILIDADE DO PROGRAMADOR)
      function getAllFields($db, $sql="") {

         $tab = $this->tabela;  // Recebo em $tab o nome da TABELA em uso no OBJETO

         if ($sql == "") {  // Caso não seja passada nenhuma SQL, assumo a SQL genérica

            $query = sprintf("SELECT * FROM $tab");  // Monto uma SQL genérica
            $result = @mysqli_query($db,$query);  // Executo a SQL
            $dados = $this->tableInfoResult($result);  // Recedo em $dados as informações da TABELA

//            if(DB::isError($result)) {  // Verifico se a execução deu errado
//               $_SESSION['erro_transacao'] = 1;
//            }

         }
         else {  // Se foi passado uma SQL, executo esta então.

            $result = @mysqli_query($db,$sql);  // Executo a SQL passada

            $dados = $this->tableInfoResult($result);  // Recebo em $dados as informações da TABELA
//            if(DB::isError($result)) {  // Verifico se a execução deu errado
//                echo $sql;
//               $_SESSION['erro_transacao'] = 1;
//            }
         }

         // Tratar esse pedaço
         $j=0;
         $array = [];
         while ($row = @mysqli_fetch_row($result)) {  // Percorro as linhas dos REGISTROS da CONSULTA

            $i = 0;
            foreach ($dados as $d) {
            //while ($dados[$i]['name'] <> '') {  // Percorro as COLUNAS da TABELA
               $nome_coluna = $d['name'];  // Pego o nome da COLUNA

               $array[$j]["$nome_coluna"] = $row[$i];  // Monto um ARRAY[X][Y] com o conteúdo da consulta

               $i++;
            }

            $j++;
         }
         
         return $array;  // Retorno esse ARRAY para o sistema
      }
//#######################################################################################################



//#######################################################################################################
//    function execQuery($db, $modo,$ sql=""){     -> Executa um método INSERT, UPDATE, DELETE,
//                                                    ou um SQL passado.
//                                                      $db   - Conexão ao Banco de Dados
//                                                      $modo - "INSERT", "UPDATE", "DELETE" ou
//                                                              "insert", "update", "delete"
//                                                      $sql  - É passado por parâmetro, ficando
//                                                              OPCIONAL o seu uso. Se for passado,
//                                                              o mesmo é executado, independente do
//                                                              seu conteúdo
//                                                              (RESPONSABILIDADE DO PROGRAMADOR)
      function execQuery($db,$modo,$sql=""){

         if ($sql == "") {  // Se a SQL não for passada
            if (($modo == "insert") or ($modo == "INSERT")) {  // Se o modo for INSERT
               return $this->w_insert($db);                    // executo o método w_insert
                                                               // passando a conexão $db
            } else
            if (($modo == "update") or ($modo == "UPDATE")) {  // Se o modo for UPDATE
               return $this->w_update($db);                    // executo o método w_update
                                                               // passando a conexão $db
            } else
            if (($modo == "delete") or ($modo == "DELETE")) {  // Se o modo for DELETE
               return $this->w_delete($db);                    // executo o método w_delete
                                                               // passando a conexão $db
            }
         } else {  // Se a SQL for passada
            @mysqli_query($db, $sql);  // Executo a SQL passada
             
//            $result = @mysqli_query($db, $sql);  // Executo a SQL passada
//            $array = [];
//            
//            if ($result->num_rows > 0) {
//                $dados = $this->tableInfoResult($result);  // Recebo em $dados as informações da TABELA
//
//                $j = 0;
//                while ($row = @mysqli_fetch_row($result)) {  // Percorro as linhas dos REGISTROS da CONSULTA
//                    $i = 0;
//                    foreach ($dados as $d) { // Percorro as COLUNAS da TABELA
//                        $nome_coluna = $d['name'];  // Pego o nome da COLUNA
//                        $array[$j]["$nome_coluna"] = $row[$i];  // Monto um ARRAY[X][Y] com o conteúdo da consulta
//                        $i++;
//                    }
//                    $j++;
//                }
//            }
//
//            return $array;  // Retorno esse ARRAY para o sistema

         }

      }
//#######################################################################################################



//#######################################################################################################
      //    Este método só será executado no caso do OBJETO possuir valores,
      //    ou seja deverá ter sido executado o método UPLOAD anteriormente.

      function w_insert($db) {
         if ($this->upload_feito == 1) {  // Se o UPLOAD já foi feito
            $tab = $this->tabela;  // Recebo em $tab o nome da TABELA em uso pelo OBJETO

            $dados = $this->tableInfo($db, $this->tabela);  // Recedo em $dados as informações da TABELA

            // Monto uma SQL de INSERT dinâmica, de acordo com os campos da tabela
            $sql_dinamico_campos = "INSERT INTO $tab (";

            $sql_dinamico_valores = "";
            $i = 0;
            foreach ($dados as $d) {
            //while ($dados[$i]['name'] <> '') {  // Percorro as COLUNAS da TABELA
               $nome_coluna = $d['name'];  // Pego o nome da COLUNA

               $str = substr_count($d['flags'],'auto_increment');  // Verifico se o campo é "auto_increment"
               if ($str == 0) { // Se não for "auto_increment" ou chave primária

                  if ($this->$nome_coluna == '') {  // Verifico se o campo está vazio
                        if (!($d['cdefault'])){ // Verifico se o campo tem não um valor padrão
                          $sql_dinamico_campos = $sql_dinamico_campos.$d['name'].",";
                      }
                  }
                  else{//O campo não está em branco
                        $sql_dinamico_campos = $sql_dinamico_campos.$d['name'].",";
                  }


                  // Vou adicionando a SQL de acordo com o tipo dos dados a serem inseridos
                  $str1 = substr_count($d['flags'],'not_null');  // Verifico se o campo é "not_null"
                  if ($str1 == 0) {  // Se não for "not_null"
                     if (($d['type'] == 'int') OR ($d['type'] == 'real')) {  // Verifico o tipo do campo
                        if ($this->$nome_coluna == '') {  // Verifico se o campo está vazio
                           if (!($d['cdefault'])) { // Verifico se o campo tem não um valor padrão
                               $sql_dinamico_valores = $sql_dinamico_valores."null ,";
                           }
                        } else {
                           $sql_dinamico_valores = $sql_dinamico_valores.$this->$nome_coluna.",";
                        }
                     } else {
                        if ($this->$nome_coluna == '') {  // Verifico se o campo está vazio
                            if (!($d['cdefault'])) {  // Verifico se o campo tem não um valor padrão
                                $sql_dinamico_valores = $sql_dinamico_valores."null ,";
                            }
                        } else {
                            $sql_dinamico_valores = $sql_dinamico_valores."'".$this->$nome_coluna."',";
                        }
                     }

                  } else {  // Se for "not_null"
                     if (($d['type'] == 'int') OR ($d['type'] == 'real')) {  // Verifico o tipo do campo
                        if ($this->$nome_coluna == '') {  // Verifico se o campo está vazio
                            if (!($d['cdefault'])) { // Verifico se o campo tem um valor padrão
                               print_r('<center><h1>O campo '.$d['name'].' não pode ser NULL</h1></center>');
                            }
                        } else {
                           $sql_dinamico_valores = $sql_dinamico_valores.$this->$nome_coluna.",";
                        }
                     } else {
                        if ($this->$nome_coluna == '') {  // Verifico se o campo está vazio
                            if (!($d['cdefault'])) { // Verifico se o campo tem um valor padrão
                               print_r('<center><h1>O campo '.$d['name'].' não pode ser NULL</h1></center>');
                            }
                        } else {
                           $sql_dinamico_valores = $sql_dinamico_valores."'".$this->$nome_coluna."',";
                        }
                     }
                  }
               }
               $i++;
            }

            // Junto em um só os pedaços da SQL, campos e valores
            $sql_dinamico_campos  = trim($sql_dinamico_campos);
            $sql_dinamico_valores = trim($sql_dinamico_valores);

            $sql_dinamico_campos  = substr($sql_dinamico_campos,0,strlen($sql_dinamico_campos)-1);
            $sql_dinamico_valores = substr($sql_dinamico_valores,0,strlen($sql_dinamico_valores)-1);

            $sql_dinamico         = $sql_dinamico_campos.") VALUES (".$sql_dinamico_valores.")";
                                  
            //$result = @mysqli_query($db,$sql_dinamico);  // Executo a SQL recém montada
            @mysqli_query($db,$sql_dinamico);  // Executo a SQL recém montada

            $this->lastInsertID = @mysqli_insert_id($db);
            
//            if(DB::isError($result)) {  // Verifico se a execução deu errado
//               // Se ocorreu um erro, retorno uma mensagem e o "OBJETO de ERRO" ($result)
//               if ($this->mensagem == 1) {
//                  print_r('<center><h1>Ocorreu um erro no INSERT.</h1></center>');
//               }
//               $_SESSION['erro_transacao'] = 1;
//               return $result;
//            }
         } else {  // Se o UPLOAD ainda não foi feito
            print_r('<center><h1>Para acessar o método execQuery(INSERT),<br>é necessário carregar os dados no objeto.</h1></center>');
         }
      }
//#######################################################################################################



//#######################################################################################################
      //    Este método só será executado no caso do OBJETO possuir valores,
      //    ou seja deverá ter sido executado o método UPLOAD anteriormente.

      function w_update($db) {

         if ($this->upload_feito == 1) {  // Se o UPLOAD já foi feito
            $tab = $this->tabela;  // Recebo em $tab o nome da TABELA em uso pelo OBJETO

            $dados = $this->tableInfo($db, $tab);  // Recedo em $dados as informações da TABELA

            // Monto uma SQL de INSERT dinâmica, de acordo com os campos da tabela
            $sql_dinamico = "UPDATE $tab set ";

            $i = 0;
            foreach ($dados as $d) {
            //while ($dados[$i]['name'] <> '') {  // Percorro as COLUNAS da TABELA
               $nome_coluna = $d['name'];  // Pego o nome da COLUNA

               $str = substr_count($d['flags'],'auto_increment');  // Verifico se o campo é "auto_increment"
               if (($str == 0) and ($d['name'] <> $this->key)) {  // Se não for "auto_increment" ou chave primária

                  $str1 = substr_count($d['flags'],'not_null');  // Verifico se o campo é "not_null"
                  if ($str1 == 0) {  // Se não for "not_null"
                     if (($d['type'] == 'int') OR ($d['type'] == 'real')) {  // Verifico o tipo do campo
                        if ($this->$nome_coluna == '') {
                           $sql_dinamico = $sql_dinamico.$d['name']." = null, ";
                        } else {
                           $sql_dinamico = $sql_dinamico.$d['name']." = ".$this->$nome_coluna.",";
                        }
                     } else {
                        if ($this->$nome_coluna == '') {
                           $sql_dinamico = $sql_dinamico.$d['name']." = null, ";
                        } else {
                           $sql_dinamico = $sql_dinamico.$d['name']." = '".$this->$nome_coluna."',";
                        }
                     }

                  } else {   // Se for "not_null"
                     if (($d['type'] == 'int') OR ($d['type'] == 'real')) {  // Verifico o tipo do campo
                        if ($this->$nome_coluna == '') {
                           print_r('<center><h1>O campo '.$d['name'].' não pode ser NULL</h1></center>');
                        } else {
                           $sql_dinamico = $sql_dinamico.$d['name']." = ".$this->$nome_coluna.",";
                        }
                     } else {
                        if ($this->$nome_coluna == '') {
                           print_r('<center><h1>O campo '.$d['name'].' não pode ser NULL</h1></center>');
                        } else {
                           $sql_dinamico = $sql_dinamico.$d['name']." = '".$this->$nome_coluna."',";
                        }
                     }
                  }
               }
               else{
                    $valorChave = $this->$nome_coluna;
               }
               $i++;
            }

            $sql_dinamico  = trim($sql_dinamico);
            $sql_dinamico  = substr($sql_dinamico,0,strlen($sql_dinamico)-1);
            $sql_dinamico  = $sql_dinamico." WHERE ".$this->key." = ".$valorChave;

            $result = $result = @mysqli_query($db,$sql_dinamico);  // Executo a SQL recém montada

//            if(DB::isError($result)) {  // Verifico se a execução deu errado
//               // Se ocorreu um erro, retorno uma mensagem e o "OBJETO de ERRO" ($result)
//               if ($this->mensagem == 1) {
//                  print_r('<center><h1>Ocorreu um erro no UPDATE.</h1></center>');
//                  echo "<center><h1>$sql_dinamico</h1></center>";
//               }
//               $_SESSION['erro_transacao'] = 1;
//               return $result;
//            }
         } else {  // Se o UPLOAD ainda não foi feito
            print_r('<center><h1>Para acessar o método execQuery(UPDATE),<br>é necessário carregar os dados no objeto.</h1></center>');
         }
      }
//#######################################################################################################



//#######################################################################################################
      //    Este método só será executado no caso do OBJETO possuir valores,
      //    ou seja deverá ter sido executado o método LOAD anteriormente.

      function w_delete($db) {

         if ($this->load_feito == 1) {  // Se o LOAD já foi feito
            $tab = $this->tabela;  // Recebo em $tab o nome da TABELA em uso pelo OBJETO

            $campoChave = $this->key;

            $sql = sprintf("DELETE FROM $tab WHERE %s=%d",$this->key,$this->$campoChave); // Monto a SQL de DELETE
            $result = $result = @mysqli_query($db,$sql);  // Executo a SQL recém montada

//            if(DB::isError($result)) {  // Verifico se a execução deu errado
//               // Se ocorreu um erro, retorno uma mensagem e o "OBJETO de ERRO" ($result)
//               if ($this->mensagem == 1) {
//                  print_r('<center><h1>Ocorreu um erro no DELETE.</h1></center>');
//                  echo "<center><h1>$sql</h1></center>";
//               }
//               $_SESSION['erro_transacao'] = 1;
//               return $result;
//            }
         } else {  // Se o LOAD ainda não foi feito
            print_r('<center><h1>Para acessar o método execQuery(DELETE),<br>é necessário carregar os dados no objeto.</h1></center>');
         }
      }
//#######################################################################################################



//#######################################################################################################
//    function geraDropDown($db, $sql, $chave) { -> Gero e retorno um ARRAY com as COLUNAS e LINHAS
//                                                  sendo que a última coluna "Check" virá marcada
//                                                  com o índice passado na variável $chave
//                                                     $db  - Conexão ao Banco de Dados
//                                                     $sql - É uma consulta tipo
//                                                     "SELECT ID, Nome, Descricao FROM TABELA"
      function gera_dropdown($db, $sql, $chave) {
        $result = @mysqli_query($db, $sql);  // Executo a SQL

        $dados = $this->tableInfoResult($result);  // Recebo em $dados as informações da TABELA

        $array = [];
        $j = 0;
        while ($row = @mysqli_fetch_row($result)) {  // Percorro as linhas dos REGISTROS da CONSULTA
            $i = 0;
            foreach ($dados as $d) {
                //while ($dados[$i]['name'] <> '') {  // Percorro as COLUNAS da TABELA
                $nome_coluna = $d['name'];  // Pego o nome da COLUNA

                $array[$j]["$nome_coluna"] = $row[$i];  // Monto um ARRAY[X][Y] com o conteúdo da consulta

                $array[$j]["Check"] = '';

                if (is_array($chave)) {
                    foreach ($chave as $c) {
                        if (in_array(trim($row[0]), $c)) {  // Se a chave for igual ao índice marcado
                            $array[$j]["Check"] = 'SELECTED';  // Marco esta linha como selected
                        }
                    }
                } else {   
                    if (trim($row[0]) == trim($chave)) {  // Se a chave for igual ao índice marcado
                        $array[$j]["Check"] = 'SELECTED';  // Marco esta linha como selected
                    }
                }
                $i++;
            }
            $j++;
        }

        return $array;  // Retorno esse ARRAY para o sistema
    }

//#######################################################################################################

    function achaChave($db, $tabela){
        $dados = $this->tableInfo($db, $tabela);

        foreach($dados as $campo) {
            $str = substr_count($campo['flags'],'primary_key');
            if($str > 0) {
                $this->key = $campo['name'];
                return true;
            }
        }

        return false;
    }
    
//      function achaChave($db){
//
//         $dados = $this->tableInfo($db, $this->tabela);
//
//         foreach($dados as $campo) {
//            if(ereg('primary_key', $campo['flags'])) {
//               $this->key = $campo['name'];
//               return true;
//            }
//         }
//         return false;
//      }

      function FormataData($data,$padrao) {
         $teste_data = explode(" ",$data);
         if ($teste_data[0]<>""){
           $data=$teste_data[0];
         }
         if ($padrao =='BR') {
            $array_data = explode ("-",$data);
            return ($array_data[2]."/".$array_data[1]."/".$array_data[0]);
         }
         else if ($padrao =='US') {
            $array_data = explode ("/",$data);
            return ($array_data[2]."-".$array_data[1]."-".$array_data[0]);
         }
         else {
            echo "Formato de data inexistente.";
         }
      }
//#######################################################################################################
      
      
      
//#######################################################################################################
    function getDataType($type) {
        $aux = "";
        
        if ($type == 1) { $aux = 'smallint'; }
        if ($type == 2) { $aux = 'tinyint'; }
        if ($type == 3) { $aux = 'int'; }
        if ($type == 4) { $aux = 'float'; }
        if ($type == 5) { $aux = 'double'; }
        if ($type == 7) { $aux = 'timestamp'; }
        if ($type == 8) { $aux = 'bigint'; }
        if ($type == 9) { $aux = 'mediumint'; }
        if ($type == 10) { $aux = 'date'; }
        if ($type == 11) { $aux = 'time'; }
        if ($type == 12) { $aux = 'datetime'; }
        if ($type == 13) { $aux = 'year'; }
        if ($type == 16) { $aux = 'bit'; }
        if ($type == 253) { $aux = 'varchar'; }
        if ($type == 254) { $aux = 'char'; }
        if ($type == 246) { $aux = 'decimal'; }    
        
        return $aux;
    }

    function getDataFlags($flags) {
        $flag = decbin($flags);
        $flag = strrev($flag);

        $resultString = "";
        
        if (!isset($flag[0])) { $flag[0] = 0; }
        if (!isset($flag[1])) { $flag[1] = 0; }
        if (!isset($flag[9])) { $flag[9] = 0; }
        
        if ($flag[0] == "1" ) { $resultString = $resultString."not_null, "; }
        if ($flag[1] == "1" ) { $resultString = $resultString."primary_key, "; }
        if ($flag[9] == "1" ) { $resultString = $resultString."auto_increment"; }

        return $resultString;
    }      
      
    function tableInfo($db, $table) {
        //$count = 0;
        //$id = 0;
        $res = array();

        $result = @mysqli_query($db, "SELECT * FROM $table");

        $fields = $result->fetch_fields();

        $i = 0;
        foreach ($fields as $val) {
            $res[$i]['table'] = $val->table;
            $res[$i]['name'] = $val->name;
            $res[$i]['type'] = $this->getDataType($val->type);
            $res[$i]['len'] = $val->length;
            $res[$i]['flags'] = $this->getDataFlags($val->flags);
            $i++;
        }

        return $res;
    }

    function tableInfoResult($result) {
        $res = array();
        
        $fields = $result->fetch_fields();

        $i = 0;
        foreach ($fields as $val) {
            $res[$i]['table'] = $val->table;
            $res[$i]['name'] = $val->name;
            $res[$i]['type'] = $this->getDataType($val->type);
            $res[$i]['len'] = $val->length;
            $res[$i]['flags'] = $this->getDataFlags($val->flags);
            $i++;
        }

        return $res;
    }  
//#######################################################################################################

    
//      function tableInfo($table) {
//          $count = 0;
//          $id    = 0;
//          $res   = array();
//
//          $id = @mysqli_list_fields('test', $table, $this->db);
//          $count = @mysqli_num_fields($id);
//
//          for ($i=0; $i<$count; $i++) {
//             $res[$i]['table'] = @mysqli_field_table ($id, $i);
//             $res[$i]['name']  = @mysqli_field_name  ($id, $i);
//             $res[$i]['type']  = @mysqli_field_type  ($id, $i);
//             $res[$i]['len']   = @mysqli_field_len   ($id, $i);
//             $res[$i]['flags'] = @mysqli_field_flags ($id, $i);
//          }
//
//          return $res;
//      }
//
//      function tableInfoResult($result) {
//
//          $count = 0;
//          $id    = 0;
//          $res   = array();
//
//          $id = $result;
//          
//          $count = @mysqli_num_fields($id);
//
//          $res['num_fields']= $count;
//
//          for ($i=0; $i<$count; $i++) {
//             $res[$i]['table'] = @mysqli_field_table ($id, $i); 
//             $res[$i]['name']  = @mysqli_field_name  ($id, $i);
//             $res[$i]['type']  = @mysqli_field_type  ($id, $i);
//             $res[$i]['len']   = @mysqli_field_len   ($id, $i);
//             $res[$i]['flags'] = @mysqli_field_flags ($id, $i);
//          }          
//
//          return $res;
//          
//      }
      
   }
?>