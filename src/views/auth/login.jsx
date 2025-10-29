import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// react-bootstrap
import { Alert, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

import { login, storeItem, storeToken } from '../../services/auth';

// -----------------------|| SIGNIN 1 ||-----------------------//

export default function SignIn1() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');
  const [alert, setAlert] = useState(null);

  const handleLogin = () => {
    login(accessToken)
      .then((response) => {
        storeToken(response.data.token);
        storeItem('name', response?.data?.company?.name);
        storeItem('email', response?.data?.company?.email);
        setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setAlert({ type: 'danger', message: 'Invalid credentials. Please try again.' });
        } else {
          setAlert({ type: 'danger', message: `Login failed: ${error.message}` });
        }
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <h4 className="mb-3 f-w-400">Login</h4>
                <p className="mt-2 text-muted ">Secure access to your onboarding API analytics</p>
                {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FeatherIcon icon="lock" />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="Enter access token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </InputGroup>

                <Button className="btn btn-block btn-primary mb-4" onClick={handleLogin}>
                  Signin
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
