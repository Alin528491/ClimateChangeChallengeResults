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

    // === FETCH LIVE GRADE 4 DATA FROM GOOGLE SHEETS RESULTS TAB ===
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-NxKzcwfrfuuBXdhYEZFY_-hR8jBNtWuW8od6u_C1RHzrbBFiPrQeGyNY93NBd4sCBeGY1iIHKgZT/pub?gid=452885745&single=true&output=csv")
        .then(response => response.text())
        .then(csv => {
            const rows = csv.trim().split("\n").map(r =>
                r.split(",").map(cell => cell.replace(/^"|"$/g, "").trim())
            );

            const headers = rows[0];
            const dataRows = rows.slice(1);

            const grade4AdvisoryLabels = [];
            const grade4Data = [];

            dataRows.forEach(row => {
                const name = row[0];
                const count = parseInt(row[1]);

                if (
                    name &&
                    !name.includes("NA") &&
                    !name.includes("Reject") &&
                    !isNaN(count) &&
                    count > 0
                ) {
                    grade4AdvisoryLabels.push(name);
                    grade4Data.push(count);
                }
            });

            console.log("✅ Grade 4 Labels:", grade4AdvisoryLabels);
            console.log("✅ Grade 4 Data:", grade4Data);

            createChart("grade4Chart", grade4Data, grade4AdvisoryLabels, "leadingAdvisoryGrade4", grade4Data.length > 0);
        })
        .catch(error => {
            console.error("❌ Failed to fetch Grade 4 data:", error);
        });

    // === CHART FUNCTION ===
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
                    : []
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

    // Create empty charts for Grade 5 and 6
    createChart("grade5Chart", grade5Data, grade5AdvisoryLabels, "leadingAdvisoryGrade5", false);
    createChart("grade6Chart", grade6Data, grade6AdvisoryLabels, "leadingAdvisoryGrade6", false);
});
