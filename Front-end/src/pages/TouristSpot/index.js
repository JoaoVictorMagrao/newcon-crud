import React, { useState, useEffect} from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { uniqueTouristSpotList } from '../../service/service';
import { AddOrRegisterTouristPoint } from './functions/addOrRegisterTouristPoint';
import { estados } from '../../Util/util';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const urlParams = new URLSearchParams(window.location.search);
const idEdit = urlParams.get('id');

const buttonText = idEdit ? 'Atualizar' : 'Cadastrar';
const pageTitle = idEdit ? 'Editar Ponto Turístico' : 'Cadastro de Ponto Turístico';

function TouristSpot() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoAtracao, setTipoAtracao] = useState('');
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [cidade, setCidade] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  

  const handleEstadoChange = (event) => {
    setEstadoSelecionado(event.target.value);
  };

  useEffect(() => {
    if (idEdit) {
      uniqueTouristSpotList(idEdit)
        .then((value) => {
          if(value.status){
            setNome(value.data.nome);
            setDescricao(value.data.descricao);
            setTipoAtracao(value.data.tipo_atracao);
            setEstadoSelecionado(value.data.estado);
            setCidade(value.data.cidade);
          }else{
            toast.error('Erro ao buscar os dados do Ponto Turístico.');
          }
          
        })
        .catch((error) => {
          toast.error('Algo de errado aconteceu, tente novamente mais tarde.');
        });
    }
  }, [idEdit]); 
  

  const handleSubmit = async (event) => {
    event.preventDefault();

      const newTouristSpot = {
        nome: nome,
        descricao: descricao,
        tipo_atracao: tipoAtracao,
        estado: estadoSelecionado,
        cidade: cidade
      };
  
      AddOrRegisterTouristPoint(idEdit, newTouristSpot, setIsButtonDisabled, setNome, setDescricao, setTipoAtracao, setEstadoSelecionado, setCidade, toast);
  };

  return (
    <div> 
     
    <Box className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{pageTitle}</h2>
        <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth className="mb-4" />
        <TextField label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} fullWidth multiline className="mb-4" />
        <TextField label="Tipo Atração" value={tipoAtracao} onChange={(e) => setTipoAtracao(e.target.value)} fullWidth className="mb-4" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Estado</InputLabel>
          <Select
            value={estadoSelecionado}
            onChange={handleEstadoChange}
            label="Estado"
          >
            {estados.map((estado) => (
              <MenuItem key={estado.nome} value={estado.sigla}>
                {estado.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} fullWidth className="mb-4" />

        <Button disabled={isButtonDisabled} type="submit" variant="contained" color="primary" className="w-full">
          {isButtonDisabled ? 'Processando...' : buttonText} 
        </Button>
      </form>
      <ToastContainer 
      autoClose={3000}
      position="bottom-right"
      theme="colored"  />
    </Box>
    
    
</div>
    
  );
}

export default TouristSpot;