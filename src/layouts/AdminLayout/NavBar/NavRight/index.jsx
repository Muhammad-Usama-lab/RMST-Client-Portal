import { Link, useNavigate } from 'react-router-dom';

// react-bootstrap
import { Dropdown, Form, ListGroup } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

// assets

// -----------------------|| NAV RIGHT ||-----------------------//

export default function NavRight() {
  const navigate = useNavigate();
  return (
    <ListGroup as="ul" bsPrefix=" " className="list-unstyled">
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown>
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0">
            <i className="material-icons-two-tone">search</i>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown drp-search">
            <Form className="px-3">
              <div className="form-group mb-0 d-flex align-items-center">
                <FeatherIcon icon="search" />
                <Form.Control type="search" className="border-0 shadow-none" placeholder="Search here. . ." />
              </div>
            </Form>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown className="drp-user">
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0 user-name">
            <i className="material-icons-two-tone user-avatar">bubble_chart</i>
            <span>
              <span className="user-name">{localStorage.getItem('name')}</span>
              <span className="user-desc">{localStorage.getItem('email')}</span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
            <Link
              to="/login"
              onClick={() => {
                localStorage.clear();
              }}
              className="dropdown-item"
            >
              <i className="material-icons-two-tone">chrome_reader_mode</i> Logout
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
    </ListGroup>
  );
}
