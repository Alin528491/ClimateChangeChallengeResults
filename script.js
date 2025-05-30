document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Page loaded. Running scripts...");

    // === LOADING SCREEN LOGIC ===
    const loadingScreen = document.getElementById("loading-screen");
    const smoothWrapper = document.getElementById("smooth-wrapper");

    if (loadingScreen) {
        gsap.to(".loading-bar", {
            width: "100%",
            duration: 2,
            ease: "power2.out"
        });

        gsap.to("#loading-screen", {
            opacity: 0,
            duration: 1.5,
            delay: 2,
            onComplete: () => {
                console.log("✅ Loading screen animation complete.");
                loadingScreen.style.display = "none"; // Hide the loading screen
                smoothWrapper.style.opacity = 1; // Show the main content
            }
        });
    } else {
        console.warn("Loading screen not found.");
        smoothWrapper.style.opacity = 1; // Fallback: Show the main content
    }

    const grade5AdvisoryLabels = [];
    const grade6AdvisoryLabels = [];
    const grade5Data = [];
    const grade6Data = [];

    // === FETCH LIVE GRADE 4 DATA FROM GOOGLE SHEETS ===
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/...../pub?gid=452885745&single=true&output=csv";

    fetch(sheetURL)
        .then(res => res.text())
        .then(csv => {
            const rows = csv.trim().split("\n").map(r => r.split(","));
            const headers = rows[0];
            const dataRows = rows.slice(1);

            const grade4AdvisoryLabels = [];
            const grade4Data = [];

            dataRows.forEach(row => {
                const name = row[0].trim();
                const count = parseInt(row[1]);

                if (!name.includes("NA") && !name.includes("Reject") && !isNaN(count)) {
                    grade4AdvisoryLabels.push(name);
                    grade4Data.push(count);
                }
            });

            createChart("grade4Chart", grade4Data, grade4AdvisoryLabels, "leadingAdvisoryGrade4", grade4Data.length > 0);
        })
        .catch(error => {
            console.error("❌ Failed to fetch Grade 4 data:", error);
        });

    // === Chart Creation Function ===
    function createChart(chartId, data, advisoryLabels, leadingAdvisoryId, hasData = true) {
        const chart = new Chart(document.getElementById(chartId), {
            type: "bar",
            data: {
                labels: advisoryLabels,
                datasets: hasData
                    ? [
                        {
                            label: "Completed",
                            data: data,
                            backgroundColor: "green",
                            borderRadius: 4
                        }
                    ]
                    : [] // Empty datasets for no data
            },
            options: {
                indexAxis: "y",
                responsive: true,
                scales: {
                    x: {
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: "Completion Rate (%)",
                            color: "white"
                        },
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
                    },
                    title: {
                        display: !hasData,
                        text: "No data available",
                        color: "white",
                        font: { size: 18 }
                    }
                }
            }
        });

        // Update the leading advisory
        const leadingAdvisoryElement = document.getElementById(leadingAdvisoryId);
        if (hasData) {
            const maxCompletion = Math.max(...data);
            const leadingAdvisories = advisoryLabels.filter((_, i) => data[i] === maxCompletion);

            if (leadingAdvisories.length === 1) {
                leadingAdvisoryElement.textContent = leadingAdvisories[0];
            } else {
                leadingAdvisoryElement.textContent = leadingAdvisories.join(" & ");
            }
        } else {
            leadingAdvisoryElement.textContent = "Error";
        }
    }

    // Still render empty Grade 5 & 6 charts (optional)
    createChart("grade5Chart", grade5Data, grade5AdvisoryLabels, "leadingAdvisoryGrade5", grade5Data.length > 0);
    createChart("grade6Chart", grade6Data, grade6AdvisoryLabels, "leadingAdvisoryGrade6", grade6Data.length > 0);
});
