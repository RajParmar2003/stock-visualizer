import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css"; // Import the CSS file

class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: "November", // Default Month
  };

  // Filter the data based on selected company and month
  filterData() {
    const { company, selectedMonth } = this.state;
    return this.props.csv_data.filter(
      (d) =>
        d.Company === company &&
        d.Date.toLocaleString("default", { month: "long" }) === selectedMonth
    );
  }

  // Draw chart using D3
  drawChart() {
    const data = this.filterData();
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Remove any existing chart before re-drawing
    d3.select("#chart").select("svg").remove();

    // Append SVG
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.Open, d.Close)),
        d3.max(data, (d) => Math.max(d.Open, d.Close)),
      ])
      .nice()
      .range([height, 0]);

    // Axes
    chart.append("g").call(d3.axisLeft(y));
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5));

    // Lines
    const lineOpen = d3
    .line()
    .x((d) => x(d.Date))
    .y((d) => y(d.Open))
    .curve(d3.curveCardinal); // Apply smooth curve
  
  const lineClose = d3
    .line()
    .x((d) => x(d.Date))
    .y((d) => y(d.Close))
    .curve(d3.curveCardinal); // Apply smooth curve
  
    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2)
      .attr("d", lineOpen);

    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2)
      .attr("d", lineClose);

    // Data points
    chart
      .selectAll(".dot-open")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Open))
      .attr("r", 5)
      .attr("fill", "#b2df8a")
      .on("mouseover", (event, d) => {
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(
            `Date: ${d.Date.toDateString()}<br>Open: ${d.Open}<br>Close: ${d.Close}<br>Difference: ${
              d.Close - d.Open
            }`
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));

    chart
      .selectAll(".dot-close")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Close))
      .attr("r", 5)
      .attr("fill", "#e41a1c")
      .on("mouseover", (event, d) => {
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(
            `Date: ${d.Date.toDateString()}<br>Open: ${d.Open}<br>Close: ${d.Close}<br>Difference: ${
              d.Close - d.Open
            }`
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));

    // Legend
    svg
      .append("g")
      .attr("transform", `translate(${width - 100}, 20)`)
      .call((g) => {
        g.append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "#b2df8a");
        g.append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text("Open Prices")
          .style("font-size", "14px");
      });

    svg
      .append("g")
      .attr("transform", `translate(${width - 100}, 50)`)
      .call((g) => {
        g.append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "#e41a1c");
        g.append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text("Close Prices")
          .style("font-size", "14px");
      });
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="child1">
        <div>
          <h3>Select Company:</h3>
          {options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                checked={this.state.company === option}
                onChange={this.handleCompanyChange}
              />
              {option}
            </label>
          ))}
        </div>
        <div>
          <h3>Select Month:</h3>
          <select value={this.state.selectedMonth} onChange={this.handleMonthChange}>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div id="chart"></div>
        <div id="tooltip"></div>
      </div>
    );
  }
}

export default Child1;