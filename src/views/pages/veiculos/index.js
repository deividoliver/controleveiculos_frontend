import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsPlusCircleFill, BsPencilSquare } from "react-icons/bs";
import { useNavigate, useLocation  } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import helper from '../../../config/helper';

import api from '../../../services/api'

import './styles.css';

function Veiculos() {
  const navigate = useNavigate();
  var location = useLocation();

  const[veiculos, setVeiculos] = useState([]);
  const[excluirVeiculo, setExcluirVeiculo] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [variantAlert, setVariantAlert] = useState('success');
  const [headAlert, setHeadAlert] = useState('');
  const [bodyAlert, setBodyAlert] = useState('');
  

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  async function listaVeiculos(){
    try {
      const response = await api.get(`veiculo`)
      // console.log(response.data)
      setVeiculos(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function excluiVeiculo(){
    try {
      const response = await api.delete(`veiculo/${excluirVeiculo.id}`);
      console.log(response)
      if(response.status === 200){
        setVariantAlert('success');
        setHeadAlert('Sucesso!')
        setBodyAlert(()=>{
          return(
            <p>
              Modelo: {excluirVeiculo.modelo? excluirVeiculo.modelo.nome : ''}<br/> 
              Placa: {excluirVeiculo.placa}<br/>
              Renavam: {excluirVeiculo.renavam}
            </p>
          )
        });
        
      }else{
        setVariantAlert('danger')
        setHeadAlert('Erro!')
        setBodyAlert(()=>{
          return(
            <p>
              Falha ao excluir veículo.
            </p>
          )
        })
      }
      setShowAlert(true)
      setShowModal(false)
      listaVeiculos()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickEditVeiculo = (id) => {
    navigate(`/veiculo/${id}`);
  }

  const handleClickCreateVeiculo = () => {
    navigate(`/veiculo`);
  }

  function showAlertMessage(){
    if(location.state.backVeiculo){
      console.log(location.state.backVeiculo)
      setVariantAlert(location.state.backVeiculo.variantAlert);
      setHeadAlert(location.state.backVeiculo.headAlert)
      setBodyAlert(()=>{
        return(
          <p>
            {location.state.backVeiculo? location.state.backVeiculo.bodyAlert : ''}
          </p>
        )
      });
      setShowAlert(true)
      window.history.replaceState({}, document.title)

    }
  }

  useEffect(()=>{
    listaVeiculos();
    if(location.state && location.state.backVeiculo){
      showAlertMessage();
    }
  },[location.state]);

  return (
    <Container className="p-3">
      
        <h1 className="header">Lista de Veículos</h1>
        <Alert show={showAlert} variant={variantAlert} onClose={() => setShowAlert(false)} transition dismissible>
          <Alert.Heading>{headAlert}</Alert.Heading>
          {bodyAlert}
        </Alert>
        <Button variant='success' onClick={handleClickCreateVeiculo}><BsPlusCircleFill /> Cadastrar</Button><br/><br/>
        
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Operações</th>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Renavam</th>
            <th>Valor</th>
            <th>Data de Cadastro</th>
            <th>Opcionais</th>
          </tr>
        </thead>
        <tbody>
        {veiculos.map(v => {
          return (
          <tr key={`row-${v.id}`} id={v.id}>
            <td>
                <Button variant='primary' onClick={()=>{handleClickEditVeiculo(v.id)}}><BsPencilSquare /> Editar</Button>
                {' '}
                <Button variant="danger"  onClick={()=>{setExcluirVeiculo(v); setShowAlert(false); handleShowModal(true)}}><BsFillArchiveFill /> Excluir</Button>
            </td>
            <td>{v.modelo.nome}</td>
            <td>{v.placa}</td>
            <td>{v.renavam}</td>
            <td>R$ {helper.float2moeda(v.valor)}</td>
            <td>{helper.formataData(v.cadastro)}</td>
            <td>{v.opcionais.map(o=>{
                  return(
                    <span key={`op-${v.id}-${o.id}`}>✅ {o.nome}<br/></span>
                  )
                })}
            </td>
          </tr>
          );
        })}
        {veiculos.length === 0 && (
          <tr key={`row-empty`}>
            <td colSpan={7} align='center'>NENHUM VEICULO CADASTRADO</td>
          </tr>
        )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir Veículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este veículo?<br/>
                    Modelo: {excluirVeiculo.modelo? excluirVeiculo.modelo.nome : ''}<br/> 
                    Placa: {excluirVeiculo.placa}<br/>
                    Renavam: {excluirVeiculo.renavam}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={excluiVeiculo}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Container>
  )
}



export default Veiculos;
