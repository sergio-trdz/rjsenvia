import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

axios.interceptors.request.use(
  config => {
    config.headers.authorization = `Bearer ${'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkM2NIVUVibVJoc1EzeXhNbzV2VnliSTFzaDZCSDJZRCIsImlhdCI6MTU4NTkzMjYzNDU0OH0.tMSht_M3ryQl5IqCirhYR1gb8j3FQ26vILT4Qpx4XrdFz-zUmqbgFYiKTaZHPpB85etRIMhxVoZf6tOrHy0fnA'}`;
    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

class App extends Component {
  state = {
    totalOrders: [],
    modalOpen: false,
    confirmationModalOpen: false,
    sku: '',
    name: '',
    quantity: 0,
    price: 0,
    orderNumber: 0,
  }

  componentDidMount () {
    axios.get('https://eshop-deve.herokuapp.com/api/v2/orders')
      .then(response => {
        //console.log(response.data.orders)
        const highestNumber = Math.max.apply(Math, response.data.orders.map((o) => {
          return Number(o.number);
        }))
        this.setState({ orderNumber: highestNumber });
        this.setState({totalOrders: response.data.orders});
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleSkuChange = (e) => {
    this.setState({sku: e.target.value});
  }
  handleNameChange = (e) => {
    this.setState({name: e.target.value});
  }
  handleQuantityChange = (e) => {
    this.setState({quantity: e.target.value});
  }
  handlePriceChange = (e) => {
    this.setState({price: e.target.value});
  }
  
  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });
  openPayModal = () => this.setState({ confirmationModalOpen: true });
  closePayModal = () => this.setState({ confirmationModalOpen: false });

  saveOrder = () => {
    this.setState({ orderNumber: this.state.orderNumber + 1 });
    const order = {
      number: this.state.orderNumber + 1,
      name: this.state.name,
      items: [{
        sku: this.state.sku,
        fulfillment: {
          quantity: this.state.quantity
        }
      }],
      totals: {
        subtotal: this.state.price
      }
    }

    const newOrders = this.state.totalOrders
		newOrders.push(order);

    this.setState({ totalOrders: newOrders });
    this.setState({ modalOpen: false });
  }
  

  render() {

    return (
      <Container>
        <h1>{ this.state.orderNumber }</h1>
        <Row>
          <Col>
            <Button 
              className="btn btn-primary btn-lg" 
              onClick={this.openModal}>
              Click to add an order
            </Button>
          </Col>
          <Col>
            <Button 
              className="btn btn-success btn-lg" 
              onClick={this.openPayModal}>
              Click to pay
            </Button>
          </Col>
        </Row>
        <Table>
          <thead className="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">SKU</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {this.state.totalOrders.map(order => (
              <tr key={order.id}>
                <td>{order.number}</td>
                <td>{order.items[0].sku}</td>
                <td>{order.name}</td>
                <td>{order.items[0].fulfillment.quantity}</td>
                <td>{order.totals.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={this.state.confirmationModalOpen} onHide={this.closePayModal}>
          <Modal.Body closeButton>
            <Modal.Title>Your payment was successful!</Modal.Title>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="primary" 
              onClick={this.closePayModal}>
                Ok
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.modalOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Forms to process</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>SKU</Form.Label>
            <Form.Control type="text" placeholder="Enter sku" value={this.state.sku} onChange={ this.handleSkuChange }/>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={this.state.name} onChange={ this.handleNameChange } />
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" placeholder="Enter quantity" value={this.state.quantity} onChange={ this.handleQuantityChange } />
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" placeholder="Enter price" value={this.state.price} onChange={ this.handlePriceChange } />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.closeModal}>Cancel</Button>
            <Button variant="primary" onClick={this.saveOrder} disabled={(this.state.sku === '' || this.state.name === '' || this.state.quantity <= 0 || this.state.price <= 0)}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default App;
