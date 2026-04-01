const puneLocations = [
  "Shivajinagar",
  "Deccan Gymkhana",
  "Kothrud",
  "Karve Nagar",
  "Erandwane",
  "Aundh",
  "Baner",
  "Balewadi",
  "Pashan",
  "Wakad",
  "Hinjewadi",
  "Bavdhan",
  "Warje",
  "Sinhagad Road",
  "Swargate",
  "Sadashiv Peth",
  "Narayan Peth",
  "Camp",
  "Koregaon Park",
  "Kalyani Nagar",
  "Viman Nagar",
  "Yerawada",
  "Mundhwa",
  "Hadapsar",
  "Magarpatta",
  "Kharadi",
  "Wagholi",
  "Lohegaon",
  "NIBM Road",
  "Kondhwa",
  "Undri",
  "Wanowrie",
  "Bibwewadi",
  "Market Yard",
  "Satara Road",
  "Dhankawadi",
  "Katraj",
  "Pimpri",
  "Chinchwad",
  "Akurdi",
  "Nigdi",
  "Pimple Saudagar",
  "Pimple Gurav",
  "Bhosari",
  "Dapodi",
  "Kasba Peth",
  "Rasta Peth",
  "Nana Peth",
  "Parvati",
  "FC Road"
];

const imageSeeds = [
  "parking_a1",
  "parking_b2",
  "parking_c3",
  "parking_d4",
  "parking_e5",
  "parking_f6",
  "parking_g7",
  "parking_h8",
  "parking_i9"
];

const slotGrid = document.getElementById("slotGrid");
const locationSelect = document.getElementById("locationSelect");
const bookingForm = document.getElementById("bookingForm");
const slotSummary = document.getElementById("slotSummary");
const locationPills = document.getElementById("locationPills");
const scrollToSlotsBtn = document.getElementById("scrollToSlotsBtn");

function padZero(value) {
  return String(value).padStart(2, "0");
}

function addHours(time, hoursToAdd) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + hoursToAdd * 60;
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const newHours = Math.floor(normalized / 60);
  const newMinutes = normalized % 60;
  return `${padZero(newHours)}:${padZero(newMinutes)}`;
}

function createSlots(location, startTime, endTime) {
  return Array.from({ length: 9 }).map((_, index) => {
    const base = index + 1;
    const level = Math.floor(index / 3) + 1;
    const row = ["A", "B", "C"][index % 3];
    const start = addHours(startTime, index % 3);
    const end = addHours(endTime, index % 2);
    const slotCode = `L${level}-${row}${base}`;

    return {
      id: slotCode,
      location,
      start,
      end,
      price: 40 + base * 7,
      image: `https://picsum.photos/seed/${imageSeeds[index]}/600/380`,
      distance: (0.4 + index * 0.2).toFixed(1)
    };
  });
}

function renderSlots(slots) {
  slotGrid.innerHTML = "";

  if (slots.length === 0) {
    slotGrid.innerHTML = '<div class="empty-state">No slots found for this timing.</div>';
    return;
  }

  slots.forEach((slot, index) => {
    const card = document.createElement("article");
    card.className = "slot-card";
    card.style.animationDelay = `${index * 0.06}s`;

    card.innerHTML = `
      <img src="${slot.image}" alt="Dummy parking spot ${slot.id}" loading="lazy" />
      <div class="slot-content">
        <div class="slot-title-row">
          <span class="slot-id">${slot.id}</span>
          <span class="price">Rs ${slot.price}/hr</span>
        </div>
        <p class="slot-meta"><strong>Place:</strong> ${slot.location}</p>
        <p class="slot-meta"><strong>Time:</strong> ${slot.start} - ${slot.end}</p>
        <p class="slot-meta"><strong>Distance:</strong> ${slot.distance} km from selected point</p>
        <span class="status">AVAILABLE</span>
      </div>
    `;

    slotGrid.appendChild(card);
  });
}

function loadLocations() {
  puneLocations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);

    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = location;
    locationPills.appendChild(pill);
  });
}

function setTodayDate() {
  const today = new Date();
  const formatted = `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;
  document.getElementById("parkingDate").value = formatted;
  document.getElementById("parkingDate").min = formatted;
  document.getElementById("startTime").value = "09:00";
  document.getElementById("endTime").value = "12:00";
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const location = locationSelect.value;
  const date = document.getElementById("parkingDate").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  if (!location || !date || !start || !end) {
    return;
  }

  if (start >= end) {
    slotSummary.textContent = "End time must be later than start time.";
    slotGrid.innerHTML = '<div class="empty-state">Please correct your selected time range.</div>';
    return;
  }

  const slots = createSlots(location, start, end);
  slotSummary.textContent = `Showing 9 available slots for ${location} on ${date}, between ${start} and ${end}.`;
  renderSlots(slots);

  document.getElementById("slotsSection").scrollIntoView({ behavior: "smooth", block: "start" });
});

scrollToSlotsBtn.addEventListener("click", () => {
  document.getElementById("bookingPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});

loadLocations();
setTodayDate();
