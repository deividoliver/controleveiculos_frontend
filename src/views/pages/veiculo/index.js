import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputMask from 'react-input-mask';
import CurrencyInput from 'react-currency-input-field';
import { useParams, useNavigate } from 'react-router-dom';


import api from '../../../services/api'

import './styles.css';
import helper from '../../../config/helper';

function Veiculo() {
  const params = useParams();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [variantAlert, setVariantAlert] = useState('success');
  const [headAlert, setHeadAlert] = useState('');
  const [bodyAlert, setBodyAlert] = useState('');
  
  const[modelos, setModelos] = useState([]);
  const[opcionais, setOpcionais] = useState([]);
  
  const[id, setId] = useState('');
  const[modeloId, setModeloId] = useState('');
  const[placa, setPlaca] = useState('');
  const[renavam, setRenavam] = useState('');
  const[valor, setValor] = useState();
  const[opcionaisToSend, setOpcionaisToSend] = useState([]);
  

  async function listaModelos(){
    try {
      const responseModelo = await api.get(`modelo`)
      setModelos(responseModelo.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function listaOpcionais(){
    try {
      const responseOpcional = await api.get(`opcional`)
      setOpcionais(responseOpcional.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getVeiculo(id){
    try {
      const responseOpcional = await api.get(`veiculo/${id}`);
      console.log(responseOpcional.data)
      
      if(responseOpcional.data){
        setId(responseOpcional.data.id)
        setPlaca(responseOpcional.data.placa)
        setRenavam(responseOpcional.data.renavam)
        setValor(responseOpcional.data.valor)
        setModeloId(responseOpcional.data.modelo.id)
        setOpcionaisToSend(responseOpcional.data.opcionais.map(o => o.id))
      }
    } catch (error) {
      console.log(error)
      navigate('/veiculos', {
        state: {
          backVeiculo: {
            variantAlert: 'danger',
            headAlert: 'Erro!',
            bodyAlert: error.response ? error.response.data.message : error.message
          },
        }
      });
    }
  }

  function handleCheck(e){
    if(e.target.checked){
      const updatedOpcionais = [...opcionaisToSend];
      updatedOpcionais.push(Number(e.target.value));
      setOpcionaisToSend(updatedOpcionais);
    }else{
      const updatedOpcionais = opcionaisToSend.filter(o => o !== Number(e.target.value));
      setOpcionaisToSend(updatedOpcionais);
    }
    console.log(opcionaisToSend)
  }  

  async function handleSubmit(event){
    event.preventDefault()

    setShowAlert(false)
    
    if(!id){
      try {
        console.log(helper.moeda2float(valor))
        const response = await api.post(`veiculo/${modeloId}/create${opcionaisToSend.length ? `?opcoes=${opcionaisToSend.join('&opcoes=')}` : ''}`, {
          "placa": placa,
          "renavam": renavam,
          "valor": helper.moeda2float(valor)
        })

        console.log(response)
        if(response.status === 200){
          navigate('/veiculos', {
            state: {
              backVeiculo: {
                variantAlert: 'success',
                headAlert: 'Sucesso!',
                bodyAlert: 'Veículo cadastrado com sucesso!'
              },
            }
          });
        }else{
          setVariantAlert('danger');
          setHeadAlert('Erro!')
          setBodyAlert(()=>{
            return(
              <p>
                Erro ao cadastrar veículo!
              </p>
            )
          });
          setShowAlert(true)
        }
      } catch (error) {
        console.log(error)
        setVariantAlert('danger');
        setHeadAlert('Erro!')
        setBodyAlert(()=>{
          return(
            <p>
              Erro ao cadastrar veículo!<br/>
              {error.response? error.response.data.message : error.message}
            </p>
          )
        });
        setShowAlert(true)
      }
    }else{
      try {
        console.log(typeof valor)
        console.log(helper.moeda2float(valor))
        const response = await api.put(`veiculo/${id}?modeloId=${modeloId}&placa=${placa}&renavam=${renavam}&valor=${helper.moeda2float(valor)}${opcionaisToSend.length ? `&opcoes=${opcionaisToSend.join('&opcoes=')}` : ''}`)
        console.log(response)

        setVariantAlert(response.status === 200 ? 'success':'danger');
        setHeadAlert(response.status === 200 ? 'Sucesso!' : 'Erro!')
        setBodyAlert(()=>{
          return(
            <p>
              {response.status === 200 ? 'Sucesso ao atualizar veículo!' : 'Erro ao atualizar veículo!'}
            </p>
          )
        });
        setShowAlert(true)

      } catch (error) {
        console.log(error)
        setVariantAlert('danger');
        setHeadAlert('Erro!')
        setBodyAlert(()=>{
          return(
            <p>
              Erro ao atualizar veículo!<br/>
              {error.response? error.response.data.message : error.message}
            </p>
          )
        });
        setShowAlert(true)
      }
    }
    
  }

  const handleClickBackVeiculos = () => {
    navigate(`/veiculos`);
  }

  useEffect(()=>{
    
    listaModelos();
    listaOpcionais();
    if(params && params.id){
      getVeiculo(params.id);
    }
    
  },[params]);

  return (
    <Container className="p-3 col-6">
      
        {id && <h1 className="header">Atualizar Veículo</h1>}
        {!id && <h1 className="header">Cadastrar Veículo</h1>}
        <Alert show={showAlert} variant={variantAlert} onClose={() => setShowAlert(false)} transition dismissible>
          <Alert.Heading>{headAlert}</Alert.Heading>
          {bodyAlert}
        </Alert>
        

        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formModelo">
                <Form.Label>Modelo</Form.Label>
                <Form.Select aria-label="Default select" value={modeloId} onChange={(e)=>(setModeloId(e.target.value))} required={true}>
                    <option>Selecione um modelo</option>
                    {modelos.map(m => {
                        return (
                            <option key={m.id} value={m.id} >{m.nome}</option>
                        )
                        })
                    }
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPlaca">
                <Form.Label>Placa</Form.Label>
                <InputMask mask="aaa-9*99" maskChar=" " value={placa} onChange={e => (setPlaca(e.target.value.toUpperCase()))} required={true} className="form-control"/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRenavam">
                <Form.Label>RENAVAM</Form.Label>
                <Form.Control type="text" placeholder="XXXXXXXXXXXXX"  value={renavam} onChange={e => (setRenavam(e.target.value.toUpperCase()))}  maxLength={12} required={true}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formValor">
                <Form.Label>Valor</Form.Label>
                <CurrencyInput
                  id="input-example"
                  name="valor"
                  placeholder="R$ 0,00"
                  value={valor}
                  decimalScale={2}
                  // decimalsLimit={2}
                  // fixedDecimalLength={2}
                  allowNegativeValue={false}
                  intlConfig={{"locale":"pt-BR","currency":"BRL"}}
                  onValueChange={(value, name) => setValor(value)}
                  className="form-control"
                  required={true}
                />
            </Form.Group>

            
             {opcionais.map((o) => (
              <div key={`default-${o.id}`} className="mb-3">
                <Form.Check 
                  type={'checkbox'}
                  id={`default-${o.id}`}
                  value={o.id}
                  label={`${o.nome}`}
                  checked={opcionaisToSend.includes(o.id)}
                  onChange={(e)=>{handleCheck(e)}}
                />
              </div>
            ))}

                {id && <Button variant="primary" type="submit">
                        Atualizar
                      </Button>}
                {!id && <Button variant="primary" type="submit">
                          Cadastrar
                        </Button>}{' '}
                <Button variant='secondary' onClick={handleClickBackVeiculos}>Voltar</Button>
                
            
        </Form>
        
    </Container>
  )
}



export default Veiculo;
