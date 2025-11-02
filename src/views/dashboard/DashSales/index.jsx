import { useEffect, useState } from 'react';

// react-bootstrap
import { Card, Col, Row } from 'react-bootstrap';

// third party
import Chart from 'react-apexcharts';
// project imports
import FeedCard from 'components/Widgets/FeedTable';
import FlatCard from 'components/Widgets/Statistic/FlatCard';
import { useNavigate } from 'react-router-dom';
import { getLivelinessLogs, getUsageStats } from 'services/company';
import { useLoading } from '../../../contexts/LoadingContext';
import { formatNumberWithCommas } from '../../../utils/number';
import { formatDateTime } from '../../../utils/date';

// -----------------------|| DASHBOARD SALES ||-----------------------//
export default function DashSales() {
  const [usageStats, setUsageStats] = useState(null);
  const navigate = useNavigate();
  const { showLoadingOverlay, hideLoadingOverlay } = useLoading();

  useEffect(() => {
    const fetchUsageStats = async () => {
      showLoadingOverlay();
      try {
        const [livelinessStats, stats] = await Promise.all([await getLivelinessLogs(), await getUsageStats()]);

        setUsageStats({ ...stats, livelinessStats });
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      } finally {
        hideLoadingOverlay();
      }
    };

    fetchUsageStats();
  }, []);


  const feedData = {
    options:
      usageStats?.livelinessStats?.last10Logs?.map((row) => ({
        icon: row?.livelinessDetected ? 'check' : 'x',
        bgclass: 'light-primary',
        heading: `${row?.nicNumber}`,
        publishon: formatDateTime(row?.createdAt)
      })) || []
  };

  const getSuccessPercentage = () =>
    `${Math.round((usageStats?.livelinessStats?.successCount / usageStats?.livelinessStats?.totalCount) * 100)}%`;

  return (
    <Row>
      <Col md={12} xl={6}>
        <Card className="flat-card">
          <div className="row-table">
            <Card.Body className="col-sm-6 br">
              <FlatCard
                params={{
                  title: 'Total Calls This Month',
                  iconClass: 'text-primary mb-1',
                  icon: 'timeline',
                  value: formatNumberWithCommas(usageStats?.thisMonth?.totalCalls)
                }}
              />
            </Card.Body>
            {/* <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
              <FlatCard
                params={{
                  title: 'Cost This Month',
                  iconClass: 'text-primary mb-1',
                  text: 'PKR',
                  value: usageStats?.thisMonth?.totalCost || 0
                }}
              />
            </Card.Body> */}
            {/* <Card.Body className="col-sm-6 card-bod">
              <FlatCard params={{ title: 'Liveliness Success Rate', iconClass: 'text-primary mb-1', icon: 'unarchive', value: '600' }} />
            </Card.Body> */}
          </div>
        </Card>

        <Card className="support-bar overflow-hidden">
          <Card.Body className="pb-0">
            <h2 className="m-0">Services Called</h2>
            <span className="text-primary">Past 3 Months</span>
            <p className="mb-3 mt-3">Total number of calls in the past 3 months tenure. </p>
          </Card.Body>
          <Card.Footer className="border-0">
            <Row className="text-center">
              {usageStats?.pastThreeMonths.map((month) => (
                <Col key={month.month}>
                  <h3 className="m-0">
                    {formatNumberWithCommas(month.totalCalls)}
                    <p className="text-primary" style={{ fontSize: 12 }}>
                      Calls
                      {/* (PKR {month.totalCost}) */}
                    </p>
                  </h3>
                  <h6>{month.month}</h6>
                </Col>
              ))}
            </Row>
          </Card.Footer>
        </Card>
      </Col>
      <Col md={12} xl={6}>
        <Card>
          <Card.Body>
            <h6>Usage This Month</h6>
            <span>Track this month's usage across all your onboarding services</span>
            <Row className="d-flex justify-content-center align-items-center">
              <Col>
                {usageStats && (
                  <Chart
                    type="pie"
                    height={285}
                    series={Object.entries(usageStats?.thisMonthServiceCalls)?.map((v) => v?.[1])}
                    options={{
                      chart: {
                        background: 'transparent'
                      },
                      labels: Object.keys(usageStats?.thisMonthServiceCalls)?.map((v) => v?.toUpperCase()),
                      legend: {
                        show: true,
                        offsetY: 50
                      },
                      dataLabels: {
                        enabled: true,
                        dropShadow: {
                          enabled: false
                        }
                      },
                      theme: {
                        mode: 'light',
                        monochrome: {
                          enabled: true,
                          color: '#7267EF'
                        }
                      },
                      responsive: [
                        {
                          breakpoint: 768,
                          options: {
                            chart: {
                              height: 320
                            },
                            legend: {
                              position: 'bottom',
                              offsetY: 0
                            }
                          }
                        }
                      ]
                    }}
                  />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12}>
        <FeedCard {...feedData} height={280} title="Liveliness Insights" successRate={getSuccessPercentage()} />
      </Col>
    </Row>
  );
}
