import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, Typography, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Tooltip, Zoom, TextField, Button } from '@mui/material';
import { Trash, Pencil } from 'phosphor-react';
import { getPontosService, deleteTouristSpot } from '../service/service';
import { searchName } from '../pages/Home/functions/searchName';
import { searchDescription } from '../pages/Home/functions/serachDescription';
import { ToastContainer, toast } from 'react-toastify';
import LoadingSpinner from './Loader';
import 'react-toastify/dist/ReactToastify.css';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




function CardPrincipalTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const [touristSpotList, setTouristSpotList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [filterValueButton, setFilterValueButton] = useState("Filtrar por nome");
  const [filterName, setFilterName] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const descriptionInputRef = useRef(null);
  const nameInputRef = useRef(null);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getPontosService(setLoading);
      setTouristSpotList(data);
      setLoading(false);
    } catch (error) {
      toast.error('Erro ao obter pontos turísticos');
      setLoading(false);
    }
  }

  const clickFilterTouristSpot = async () => {
    try {
      if (filterValueButton === "Filtrar por nome") {
        if (filterName) {
          const data = await searchName(filterName, toast);
          setTouristSpotList(data);
          setLoading(false);
        } else {
          toast.warning('O filtro de nome não pode estar vazio');
          nameInputRef.current.focus();
        }

      } else {
        if (filterDescription) {
          const data = await searchDescription(filterDescription, toast);
          setTouristSpotList(data);
          setLoading(false);
        } else {
          toast.warning('O filtro de descrição não pode estar vazio');
          descriptionInputRef.current.focus();
        }
      }

    } catch (error) {
      toast.error('Erro ao filtrar pontos turísticos, verifique o servidor.');
    }
  };

  const handleClickOpen = (id) => {
    setIdToDelete(id);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleExcluir = async () => {
    const response = await deleteTouristSpot(idToDelete);
    if (response === 200) {
      toast.success('Ponto Turístico excluido com sucesso!');
      fetchData();
    } else {
      toast.error('Erro ao cadastrar Ponto Turístico.');
    }
    setOpen(false);
  };

  const handleButtonEditTouristSpot = async (id) => {
    window.location.href = `/PontoTuristico?id=${id}`;
  };

  const handleNameClick = (event) => {

    const nameFilter = event.target.value;
    setFilterName(nameFilter);
    setFilterValueButton('Filtrar por nome');
    setFilterDescription('');

  };

  const handleDescriptionClick = (event) => {

    const descriptionFilter = event.target.value;
    setFilterDescription(descriptionFilter);
    setFilterValueButton('Filtrar por descrição');
    setFilterName('');
  };



  return (
    <div>

      <div>
        {loading && <LoadingSpinner />}
      </div>

      <div className='w-3/5 mx-auto mt-5'>
        <div className='flex justify-around mb-5 items-center'>
          <TextField
            label="Filtrar por Nome"
            variant="outlined"
            margin="normal"
            onChange={handleNameClick}
            value={filterName}
            className='w-1/4'
            inputRef={nameInputRef}
          />

          <TextField
            label="Filtrar por Descrição"
            variant="outlined"
            margin="normal"
            onChange={handleDescriptionClick}
            value={filterDescription}
            className='w-1/4'
            inputRef={descriptionInputRef}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={clickFilterTouristSpot}
            className='h-10'
          >
            <Typography>{filterValueButton}</Typography>
          </Button>
        </div>
        <TableContainer component={Paper}>

          <Table aria-label='pontos table'>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Cidade</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Excluir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {touristSpotList.length > 0 ? (
                touristSpotList.slice(startIndex, endIndex).map((ponto) => (
                  <TableRow key={ponto.id}>
                    <TableCell>{ponto.nome}</TableCell>
                    <TableCell>{ponto.descricao}</TableCell>
                    <TableCell>{ponto.endereco}</TableCell>
                    <TableCell>{ponto.estado}</TableCell>
                    <TableCell>{ponto.cidade}</TableCell>
                    <TableCell>
                      <Tooltip arrow TransitionComponent={Zoom} title="Editar">
                        <Pencil
                          size={25}
                          color='black'
                          onClick={() => handleButtonEditTouristSpot(ponto.id)}
                          className='cursor-pointer ml-3'
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip arrow TransitionComponent={Zoom} title="Excluir">
                        <Trash
                          size={25}
                          color='red'

                          onClick={() => handleClickOpen(ponto.id)}
                          className='cursor-pointer ml-3'
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>Nenhum ponto turístico cadastrado!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from} Até ${to} de ${count}`}
            component='div'
            count={touristSpotList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        disableEscapeKeyDown
        aria-describedby="alert-dialog-slide-description"

      >
        <DialogTitle>{"Excluir Ponto Turístico"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Tem certeza de que deseja excluir este Ponto Turístico? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleExcluir}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        autoClose={3000}
        position="bottom-right"
        theme="colored" />
    </div>
  );
}

export default CardPrincipalTable;