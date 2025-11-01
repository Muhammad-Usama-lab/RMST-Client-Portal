import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// react-bootstrap
import { Card, Col, Row } from 'react-bootstrap';

// project imports
import SimpleBar from 'simplebar-react';

// -----------------------|| FEED CARD ||-----------------------//

export default function FeedCard({ wrapclass, title, height, options, successRate }) {
  return (
    <Card className={wrapclass}>
      <Card.Header>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Card.Title as="h5">{title}</Card.Title>
          </div>
          <Link to="/reports/logs" className="text-primary">
            View All
          </Link>
        </div>
      </Card.Header>
      <SimpleBar style={{ height }}>
        <Card.Body>
          {options.map((x, i) => (
            <Row className={`align-items-center ${i === options.length - 1 ? '' : 'mb-4'}`} key={i}>
              <Col className="col-auto p-r-0">
                <i className={`feather icon-${x.icon} ${x.bgclass ? `bg-${x.bgclass}` : 'bg-light-primary'} feed-icon p-2 wid-30 hei-30`} />
              </Col>
              <Col>
                {/* <Link> */}
                <h6 className="m-b-5">
                  {x.heading} <span className="text-muted float-end f-14">{x.publishon}</span>
                </h6>
                {/* </Link> */}
              </Col>
            </Row>
          ))}
        </Card.Body>
      </SimpleBar>
    </Card>
  );
}

FeedCard.propTypes = { wrapclass: PropTypes.string, title: PropTypes.string, height: PropTypes.string, options: PropTypes.any };
