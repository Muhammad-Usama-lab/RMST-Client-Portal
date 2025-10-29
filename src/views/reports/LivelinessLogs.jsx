import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import MainCard from '../../components/Card/MainCard';
import axiosInstance from '../../utils/axios';
import { useLoading } from '../../contexts/LoadingContext';

const LivelinessLogs = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { showLoadingOverlay, hideLoadingOverlay } = useLoading();

  useEffect(() => {
    const fetchLivelinessLogs = async () => {
      try {
        showLoadingOverlay();
        const params = {
          page: currentPage,
          limit: 20 // Assuming a default limit of 20
        };
        if (startDate) {
          params.startDate = startDate;
        }
        if (endDate) {
          params.endDate = endDate;
        }
        const response = await axiosInstance.get('/company/getLivelinessLogs', { params });
        setApiData(response.data.data);
        setStats(response?.data?.stats);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err);
      } finally {
        hideLoadingOverlay();
      }
    };

    fetchLivelinessLogs();
  }, [triggerFetch, currentPage]);

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
    setCurrentPage(1); // Reset to first page on new search
    setTriggerFetch((prev) => prev + 1);
  };

  const handleNextPage = () => {
    if (pagination && pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
      setTriggerFetch((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination && pagination.hasPrev) {
      setCurrentPage((prev) => prev - 1);
      setTriggerFetch((prev) => prev + 1);
    }
  };

  const cardData = useMemo(() => {
    if (!apiData)
      return { totalSuccessCalls: 0, totalFailedCalls: 0, totalCalls: 0, totalAmount: 0, successPercentage: 0, failedPercentage: 0 };

    const totalSuccessCalls = stats?.successCount;
    const totalFailedCalls = stats?.failedCount;
    const totalCalls = stats.totalCalls;
    const totalAmount = 0; // Amount is not in the provided API response for liveliness logs

    const successPercentage = stats?.successRate;
    const failedPercentage = stats?.successRate ? 100 - Number(stats?.successRate) : 0;

    return {
      totalSuccessCalls,
      totalFailedCalls,
      totalCalls,
      totalAmount,
      successPercentage,
      failedPercentage
    };
  }, [apiData]);

  return (
    <MainCard title="Liveliness Logs">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={startDate || ''} max={endDate} onChange={handleStartDateChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" value={endDate || ''} min={startDate} onChange={handleEndDateChange} />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <p className="text-danger">Error: {error.message}</p>}

      <Row className="mb-4 mt-3">
        <Col md={4} className="mb-4">
          <Card className="bg-light h-80">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2">Total Success Calls</h6>
                  <h3 className="mb-0">
                    {cardData.totalSuccessCalls} ({Math.round(Number(cardData.successPercentage))}%)
                  </h3>
                </div>
                <i className="material-icons-two-tone f-30">check_circle</i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-white bg-primary h-80">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2 text-white">Total Failed Calls</h6>
                  <h3 className="mb-0 text-white">
                    {cardData.totalFailedCalls} ({Math.round(Number(cardData.failedPercentage))}%)
                  </h3>
                </div>
                <i className="material-icons-two-tone f-30 text-white">cancel</i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="bg-light h-80">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2">Total Calls</h6>
                  <h3 className="mb-0">{cardData.totalCalls}</h3>
                  <h5 className="mb-0">PKR {cardData.totalAmount.toFixed(2)}</h5>
                </div>
                <i className="material-icons-two-tone f-30">phone</i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="table-scroll-container mt-3">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Identity Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {apiData &&
              apiData.map((log, index) => (
                <tr key={log._id || index}>
                  <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                  <td>{log.nicNumber}</td>
                  <td>{log.livelinessDetected ? 'Success' : 'Failed'}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      {pagination && (
        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={handlePrevPage} disabled={!pagination.hasPrev}>
            Previous
          </Button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button variant="secondary" onClick={handleNextPage} disabled={!pagination.hasNext}>
            Next
          </Button>
        </div>
      )}
    </MainCard>
  );
};

export default LivelinessLogs;
