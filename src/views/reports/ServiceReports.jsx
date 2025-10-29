import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Table, Form, Button, Card } from 'react-bootstrap';
import MainCard from '../../components/Card/MainCard';
import axiosInstance from '../../utils/axios';
import { useLoading } from '../../contexts/LoadingContext';

const ServiceReports = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const { showLoadingOverlay, hideLoadingOverlay } = useLoading();

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        showLoadingOverlay();
        const params = {};
        if (startDate) {
          params.startDate = startDate;
        }
        if (endDate) {
          params.endDate = endDate;
        }
        const response = await axiosInstance.get('/company/getUsage', { params });
        setApiData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        hideLoadingOverlay();
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [triggerFetch,]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTriggerFetch((prev) => prev + 1);
  };

  const { dynamicHeaders, tableData, cardData } = useMemo(() => {
    if (!apiData) return { dynamicHeaders: [], tableData: [], cardData: {} };

    const allCallTypes = new Set();
    const aggregatedCardData = {};

    apiData.successfulCalls.forEach((entry) => {
      entry.calls.forEach((call) => {
        allCallTypes.add(call.call);
        if (!aggregatedCardData[call.call]) {
          aggregatedCardData[call.call] = { totalCount: 0, totalCost: 0 };
        }
        aggregatedCardData[call.call].totalCount += call.count;
        aggregatedCardData[call.call].totalCost += call.cost;
      });
    });

    const sortedCallTypes = Array.from(allCallTypes).sort();

    const processedTableData = apiData.successfulCalls.map((entry) => {
      const row = { date: entry.date };
      let totalCalls = 0;

      sortedCallTypes.forEach((callType) => {
        const callEntry = entry.calls.find((c) => c.call === callType);
        row[callType] = callEntry ? callEntry.count : 0;
        totalCalls += callEntry ? callEntry.count : 0;
      });
      row.totalCalls = totalCalls;
      return row;
    });

    const headers = ['Date', 'Total Calls', ...sortedCallTypes];

    return { dynamicHeaders: headers, tableData: processedTableData, cardData: aggregatedCardData };
  }, [apiData]);

  return (
    <Row>
      <Col>
        <MainCard title="Service Reports">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" value={startDate || ''} max={endDate} onChange={handleStartDateChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" value={endDate || ''} min={startDate} onChange={handleEndDateChange} />
                </Form.Group>
              </Col>
              {/* <Col md={4}>
                <Form.Group>
                  <Form.Label>Services Filter</Form.Label>
                  <Form.Control as="select">
                    <option>Select Service</option>
                    <option>Service 1</option>
                    <option>Service 2</option>
                    <option>Service 3</option>
                  </Form.Control>
                </Form.Group>
              </Col> */}
              <Col md={4} className="d-flex align-items-end">
                <Button variant="primary" type="submit" disabled={loading}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>

          {error && <p className="text-danger">Error: {error.message}</p>}

          {/* Cards Section */}

          <Row className="mb-4">
            {Object.entries(cardData).map(([serviceName, data], index) => (
              <Col md={3} key={serviceName} className="mb-4">
                <Card className={index % 2 === 0 ? 'bg-light' : 'text-white bg-primary'}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className={`mb-2 ${index % 2 === 0 ? '' : 'text-white'}`}>{serviceName.toUpperCase()}</h6>
                        <h3 className={`mb-0 ${index % 2 === 0 ? '' : 'text-white'}`}>{data.totalCount}</h3>
                        <h5 className={`mb-0 ${index % 2 === 0 ? '' : 'text-white'}`}>PKR {data.totalCost.toFixed(2)}</h5>
                      </div>
                      <i className={`material-icons-two-tone f-30 ${index % 2 === 0 ? '' : 'text-white'}`}>library_add_check</i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* <h5 className="mt-4">Dynamic Service Call Reports</h5> */}
          <div className="table-scroll-container">
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  {dynamicHeaders.map((header) => (
                    <th key={header} style={{ fontSize: 12 }}>
                      {header?.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.totalCalls}</td>
                    {dynamicHeaders.slice(2).map((header) => (
                      <td key={header}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </MainCard>
      </Col>
    </Row>
  );
};

export default ServiceReports;
