const inputData = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 4,
    avgDailyIncomePopulation: 0.73
  },
  periodType: 'days',
  timeToElapse: 38,
  reportedCases: 2747,
  population: 92931687,
  totalHospitalBeds: 678874
};

let factor;

const covid19ImpactEstimator = (data) => {
  // eslint-disable-next-line no-param-reassign
  data = inputData;
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;

  if (periodType === 'months') {
    factor = 2 ** Math.floor(timeToElapse * (30 / 3));
  }

  if (periodType === 'weeks') {
    factor = 2 ** Math.floor(timeToElapse * (7 / 3));
  }

  if (periodType === 'days') {
    factor = 2 ** Math.floor(timeToElapse * (1 / 3));
  }

  const outputData = {
    data,
    estimate: {
      impact: {
        currentlyInfected: reportedCases * 10,
        infectionsByRequestedTime: reportedCases * 10 * factor,
        severeCasesByRequestedTime: 0.15 * reportedCases * 10 * factor,
        hospitalBedsByRequestedTime: Math.floor(
          0.35 * totalHospitalBeds - 0.15 * reportedCases * 10 * factor
        ),
        casesForICUByRequestedTime: 0.05 * reportedCases * 10 * factor,
        casesForVentilatorsByRequestedTime: Math.floor(
          0.02 * reportedCases * 10 * factor
        ),
        dollarsInFlight: Math.floor(
          reportedCases
            * 10
            * factor
            * avgDailyIncomePopulation
            * avgDailyIncomeInUSD
            * timeToElapse
        )
      }, // your best case estimation
      severeImpact: {
        currentlyInfected: reportedCases * 50,
        infectionsByRequestedTime: reportedCases * 50 * factor,
        severeCasesByRequestedTime: 0.15 * (reportedCases * 50 * factor),
        hospitalBedsByRequestedTime: Math.floor(
          0.35 * totalHospitalBeds - 0.15 * reportedCases * 50 * factor
        ),
        casesForICUByRequestedTime: Math.floor(
          0.05 * (reportedCases * 50 * factor)
        ),
        casesForVentilatorsByRequestedTime: Math.floor(
          0.02 * (reportedCases * 50 * factor)
        ),
        dollarsInFlight: Math.floor(
          reportedCases
            * 50
            * factor
            * avgDailyIncomePopulation
            * avgDailyIncomeInUSD
            * timeToElapse
        ) // over a 30 days period.
      } // your
    }
  };

  return outputData;
};

export default covid19ImpactEstimator;
