// ==== CLIMATE CHALLENGE RESULTS CHARTS ====

const grade4Chart = new Chart(document.getElementById("grade4Chart"), {
    type: "bar",
    data: {
        labels: ["Advisory 1", "Advisory 2", "Advisory 3", "Advisory 4", "Advisory 5"],
        datasets: [
            {
                label: "Completed",
                data: [20, 35, 50, 10, 60], // <-- Change values here
                backgroundColor: "green",
                borderRadius: 4
            },
            {
                label: "Not Completed",
                data: [80, 65, 50, 90, 40], // <-- 100 - Completion values
                backgroundColor: "red",
                borderRadius: 4
            }
        ]
    },
    options: {
        indexAxis: "y",
        responsive: true,
        scales: {
            x: {
                min: 0,
                max: 100,
                title: { display: true, text: "Completion Rate (%)", color: "white" },
                ticks: { color: "white" },
                grid: { color: "gray" }
            },
            y: {
                ticks: { color: "white" },
                grid: { color: "gray" }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            }
        }
    }
});

// Grade 5 & 6 Placeholder Empty Charts
const emptyChartConfig = {
    type: "bar",
    data: {
        labels: [],
        datasets: []
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "No data yet",
                color: "white",
                font: { size: 18 }
            },
            legend: { display: false }
        },
        scales: {
            x: { ticks: { color: "white" }, grid: { color: "gray" } },
            y: { ticks: { color: "white" }, grid: { color: "gray" } }
        }
    }
};

new Chart(document.getElementById("grade5Chart"), emptyChartConfig);
new Chart(document.getElementById("grade6Chart"), emptyChartConfig);
