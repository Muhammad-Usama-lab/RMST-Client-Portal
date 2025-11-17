import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import MainCard from '../../components/Card/MainCard';
import { getActiveServices } from '../../services/company';
import axiosInstance from '../../utils/axios';
import { useLoading } from '../../contexts/LoadingContext';
import { CSVLink } from 'react-csv';
import { formatDateTime } from '../../utils/date';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";


const LivelinessLogs = () => {
  dayjs.extend(utc);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { showLoadingOverlay, hideLoadingOverlay } = useLoading();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

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
        if (selectedService) {
          params.service = selectedService;
        }
        const response = await axiosInstance.get('/company/getServiceLogs', { params });
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
  }, [triggerFetch, currentPage, selectedService]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getActiveServices();
        setServices(response.map(s => s.service));
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setEndDate(null);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
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

    const totalSuccessCalls = stats?.successCount || 0;
    const totalFailedCalls = stats?.failedCount || 0;
    const totalCalls = stats.totalCalls || stats?.totalCount || 0;
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

  const csvData = useMemo(() => {
    if (!apiData) return [];

    const headers = ['Date', 'Identity Number', selectedService === 'liveliness' ? 'Status' : 'Service'];
    const data = apiData.map((log) => [
      formatDateTime(log.createdAt),
      log.nicNumber,
      selectedService === 'liveliness' ? (log.livelinessDetected ? 'Success' : 'Failed') : log.serviceType
    ]);

    return [headers, ...data];
  }, [apiData, selectedService]);

  return (
    <MainCard title="Service Calls">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={startDate || ''} onChange={handleStartDateChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" value={endDate || ''} min={startDate} onChange={handleEndDateChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Service</Form.Label>
              <Form.Control as="select" value={selectedService} onChange={handleServiceChange}>
                <option value="">All Services</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button variant="primary" type="submit">
              Search
            </Button>
            {apiData && (
              <CSVLink data={csvData} filename={"liveliness-logs.csv"} className="btn btn-outline-primary ms-2">
                Download CSV
              </CSVLink>
            )}
          </Col>
        </Row>
      </Form>

      {error && <p className="text-danger">Error: {error.message}</p>}

      <Row className="mb-4 mt-3">
        {selectedService === 'liveliness' && (
          <>
            <Col md={4} className="mb-4">
              <Card className="bg-light h-80">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-2">Total Success Calls</h6>
                      <h3 className="mb-0">
                        {cardData.totalSuccessCalls.toLocaleString()} ({Math.round(Number(cardData.successPercentage))}%)
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
                        {cardData.totalFailedCalls.toLocaleString()} ({Math.round(Number(cardData.failedPercentage))}%)
                      </h3>
                    </div>
                    <i className="material-icons-two-tone f-30 text-white">cancel</i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
        <Col md={4} className="mb-4">
          <Card className="bg-light h-80">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-2">Total Calls</h6>
                  <h3 className="mb-0">{cardData.totalCalls.toLocaleString()}</h3>
                  {/* <h5 className="mb-0">PKR {cardData.totalAmount.toFixed(2)}</h5> */}
                </div>
                <i className="material-icons-two-tone f-30">addchart</i>
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
              {selectedService === 'liveliness' ? <th>Status</th> : <th>Service</th>}
            </tr>
          </thead>
          <tbody>
            {apiData &&
              apiData.map((log, index) => (
                <tr key={log._id || index}>
                  <td>{dayjs(log.createdAt).utc().format("DD-MMM-YYYY hh:mm a")}</td>
                  <td>{log.nicNumber}</td>
                  <td>
                    {selectedService === 'liveliness'
                      ? log.livelinessDetected
                        ? 'Success'
                        : 'Failed'
                      : log.serviceType}
                  </td>
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
