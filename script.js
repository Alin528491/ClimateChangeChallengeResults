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
        console.warn("⚠️ Loading screen not found.");
        smoothWrapper.style.opacity = 1; // Fallback: Show the main content
    }

    // === CHART DATA AND CREATION ===
    const grade4AdvisoryLabels = ["Mr. Crimi", "Ms. Joyce", "Ms. Bruce / Ms. Purcell", "Ms. Meritt", "Mr. Kroot"];
    const grade5AdvisoryLabels = ["Ms. Smith", "Mr. Johnson", "Ms. Lee", "Mr. Brown"];
    const grade6AdvisoryLabels = ["Ms. Taylor", "Mr. Anderson", "Ms. Davis", "Mr. Wilson"];

    // Update these arrays to change the data
    const grade4Data = [20, 30, 64, 36]; // Example data for Grade 4
    const grade5Data = [50, 60, 70, 80]; // Example data for Grade 5
    const grade6Data = [40, 50, 60, 70]; // Example data for Grade 6

    // Function to create a chart
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

    // Create initial charts
    createChart("grade4Chart", grade4Data, grade4AdvisoryLabels, "leadingAdvisoryGrade4", grade4Data.length > 0);
    createChart("grade5Chart", grade5Data, grade5AdvisoryLabels, "leadingAdvisoryGrade5", grade5Data.length > 0);
    createChart("grade6Chart", grade6Data, grade6AdvisoryLabels, "leadingAdvisoryGrade6", grade6Data.length > 0);
});