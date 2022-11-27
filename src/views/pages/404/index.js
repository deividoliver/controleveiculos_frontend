import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { AiTwotoneHome } from "react-icons/ai";
import imagem404 from '../../../404.png'
import {  useNavigate } from 'react-router-dom';


function NotFound() {
  const navigate = useNavigate();

  const handleClickGoHome = () => {
    navigate(`/`);
  }

  return (
    <Container className="p-3 col-6">
      <Card style={{ width: '100%' }}>
        <Card.Img variant="top" src={imagem404} style={{ width: '20%' }}/>
        <Card.Body>
          <Card.Title>404</Card.Title>
          <Card.Text>
            Esta pagina que está tentando acessar não foi encontrada
          </Card.Text>
          <Button variant="primary" onClick={handleClickGoHome}><AiTwotoneHome /> Volta para Inicio</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NotFound;
