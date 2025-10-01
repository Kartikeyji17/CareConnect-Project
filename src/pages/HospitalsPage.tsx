import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import "../styles/hospitalsPage.css";

type Hospital = {
  id: string;
  name: string;
  address: string;
  contact: string;
  distance: number;
  resources: {
    blood: number;
    medicine: number;
    oxygen: number;
    beds?: number;
  };
};

export default function HospitalsPage(): React.JSX.Element {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");

  // Request Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [requesting, setRequesting] = useState(false);

  // Resource selection + quantities
  const [needBlood, setNeedBlood] = useState(false);
  const [bloodQty, setBloodQty] = useState(1);

  const [needMedicine, setNeedMedicine] = useState(false);
  const [medicineQty, setMedicineQty] = useState(1);

  const [needOxygen, setNeedOxygen] = useState(false);
  const [oxygenQty, setOxygenQty] = useState(1);

  const [needBeds, setNeedBeds] = useState(false);
  const [bedsQty, setBedsQty] = useState(1);

  const [note, setNote] = useState("");

  // --- Fetch hospitals with real-time updates and safe defaults ---
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "hospitals"),
      (snapshot) => {
        const hospitalList: Hospital[] = snapshot.docs.map((d) => {
          const data = d.data() as Partial<Hospital> & {
            blood?: number;
            medicine?: number;
            oxygen?: number;
            beds?: number;
          };

          return {
            id: d.id,
            name: data.name || "Unnamed Hospital",
            address: data.address || "Unknown Address",
            contact: data.contact || "N/A",
            distance: data.distance ?? 0,
            resources: {
              blood: data.blood ?? 0,
              medicine: data.medicine ?? 0,
              oxygen: data.oxygen ?? 0,
              beds: data.beds ?? 0,
            },
          };
        });

        setHospitals(hospitalList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching hospitals:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // --- Request Modal Handlers ---
  const openRequestModal = (h: Hospital) => {
    setSelectedHospital(h);
    setNeedBlood(false);
    setBloodQty(1);
    setNeedMedicine(false);
    setMedicineQty(1);
    setNeedOxygen(false);
    setOxygenQty(1);
    setNeedBeds(false);
    setBedsQty(1);
    setNote("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHospital(null);
  };

  const submitRequest = async () => {
    if (!selectedHospital) return;
    if (!needBlood && !needMedicine && !needOxygen && !needBeds) {
      alert("Please select at least one resource to request.");
      return;
    }

    const items: Record<string, number> = {};
    if (needBlood) items.blood = Math.max(1, Math.floor(bloodQty));
    if (needMedicine) items.medicine = Math.max(1, Math.floor(medicineQty));
    if (needOxygen) items.oxygen = Math.max(1, Math.floor(oxygenQty));
    if (needBeds) items.beds = Math.max(1, Math.floor(bedsQty));

    setRequesting(true);
    try {
      const user = auth.currentUser;
      const requesterName =
        user?.displayName?.trim() || user?.email?.split("@")[0] || "Guest";

      // Log the request before sending
      console.log("Submitting request to Firestore:", {
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        items,
        note: note.trim() || null,
        status: "Pending",
        requesterId: user?.uid || null,
        requesterName,
        requesterEmail: user?.email || null,
        createdAt: new Date().toISOString(), // just for log, not Firestore
      });

      await addDoc(collection(db, "requests"), {
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        items,
        note: note.trim() || null,
        status: "Pending",
        requesterId: user?.uid || null,
        requesterName,
        requesterEmail: user?.email || null,
        createdAt: serverTimestamp(),
      });

      alert("Request submitted — hospital and admins will be notified.");
      closeModal();
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to submit request. Try again.");
    } finally {
      setRequesting(false);
    }
  };

  // --- Filters ---
  const filteredHospitals = hospitals.filter((h) => {
    let nameMatch = true,
      serviceMatch = true,
      distanceMatch = true,
      locationMatch = true;

    if (nameFilter)
      nameMatch = h.name.toLowerCase().includes(nameFilter.toLowerCase());
    if (serviceFilter && serviceFilter !== "all")
      serviceMatch = (h.resources as any)[serviceFilter] > 0;
    if (distanceFilter)
      distanceMatch = h.distance <= parseFloat(distanceFilter);
    if (locationFilter)
      locationMatch = h.address
        .toLowerCase()
        .includes(locationFilter.toLowerCase());

    return nameMatch && serviceMatch && distanceMatch && locationMatch;
  });

  return (
    <div className="hospitals-page">
      <section className="hospitals-section">
        <div className="container">
          <h1>Find Hospitals</h1>
          <p className="section-description">
            Locate hospitals with available emergency resources like blood,
            medicine, oxygen and beds. Filter by name, distance, or services.
          </p>

          {/* Filters */}
          <div className="search-filter">
            <div className="filter-grid">
              <div className="filter-item">
                <label htmlFor="name">Hospital Name</label>
                <input
                  id="name"
                  placeholder="Search by hospital name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div className="filter-item">
                <label htmlFor="location">Your Location (text)</label>
                <input
                  id="location"
                  placeholder="Enter your location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <div className="filter-item">
                <label htmlFor="service">Service Required</label>
                <select
                  id="service"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="">All Services</option>
                  <option value="blood">Blood</option>
                  <option value="medicine">Medicine</option>
                  <option value="oxygen">Oxygen</option>
                  <option value="beds">Beds</option>
                </select>
              </div>
              <div className="filter-item">
                <label htmlFor="distance">Distance</label>
                <select
                  id="distance"
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(e.target.value)}
                >
                  <option value="">Any Distance</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="15">Within 15 km</option>
                  <option value="20">Within 20 km</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospital Cards */}
          <div className="hospital-grid">
            {loading ? (
              <p>Loading hospitals...</p>
            ) : filteredHospitals.length === 0 ? (
              <p>No hospitals found. Try adjusting filters.</p>
            ) : (
              filteredHospitals.map((h) => (
                <div className="hospital-card" key={h.id}>
                  <div className="hospital-info">
                    <h3>{h.name}</h3>
                    <p className="hospital-address">
                      <i className="fas fa-map-marker-alt"></i> {h.address}
                    </p>
                    <div className="hospital-contact">
                      <p>
                        <i className="fas fa-phone"></i> {h.contact}
                      </p>
                      <p className="hospital-distance">{h.distance} km away</p>
                    </div>
                    <div className="hospital-services">
                      <span
                        className={`service-tag ${
                          (h.resources?.blood ?? 0) > 0
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        <i className="fas fa-tint"></i> Blood (
                        {h.resources?.blood ?? 0})
                      </span>
                      <span
                        className={`service-tag ${
                          (h.resources?.medicine ?? 0) > 0
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        <i className="fas fa-pills"></i> Medicine (
                        {h.resources?.medicine ?? 0})
                      </span>
                      <span
                        className={`service-tag ${
                          (h.resources?.oxygen ?? 0) > 0
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        <i className="fas fa-wind"></i> Oxygen (
                        {h.resources?.oxygen ?? 0})
                      </span>
                      <span
                        className={`service-tag ${
                          (h.resources?.beds ?? 0) > 0
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        <i className="fas fa-procedures"></i> Beds (
                        {h.resources?.beds ?? 0})
                      </span>
                    </div>
                  </div>
                  <div className="hospital-actions">
                    <button className="btn btn-outline">View Details</button>
                    <button className="btn btn-primary">Contact Now</button>
                    <button
                      className="btn btn-request"
                      onClick={() => openRequestModal(h)}
                    >
                      Request Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal - Request Form */}
      {showModal && selectedHospital && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="requestModalTitle"
        >
          <div className="modal-content">
            <h2 id="requestModalTitle">
              Request resources from {selectedHospital.name}
            </h2>

            <div className="form-row">
              <label>
                <input
                  type="checkbox"
                  checked={needBlood}
                  onChange={(e) => setNeedBlood(e.target.checked)}
                />{" "}
                Request Blood
              </label>
              <input
                type="number"
                min={1}
                value={bloodQty}
                disabled={!needBlood}
                onChange={(e) =>
                  setBloodQty(Math.max(1, Number(e.target.value)))
                }
                className="qty-input"
              />
            </div>
            <div className="form-row">
              <label>
                <input
                  type="checkbox"
                  checked={needMedicine}
                  onChange={(e) => setNeedMedicine(e.target.checked)}
                />{" "}
                Request Medicine
              </label>
              <input
                type="number"
                min={1}
                value={medicineQty}
                disabled={!needMedicine}
                onChange={(e) =>
                  setMedicineQty(Math.max(1, Number(e.target.value)))
                }
                className="qty-input"
              />
            </div>
            <div className="form-row">
              <label>
                <input
                  type="checkbox"
                  checked={needOxygen}
                  onChange={(e) => setNeedOxygen(e.target.checked)}
                />{" "}
                Request Oxygen
              </label>
              <input
                type="number"
                min={1}
                value={oxygenQty}
                disabled={!needOxygen}
                onChange={(e) =>
                  setOxygenQty(Math.max(1, Number(e.target.value)))
                }
                className="qty-input"
              />
            </div>
            <div className="form-row">
              <label>
                <input
                  type="checkbox"
                  checked={needBeds}
                  onChange={(e) => setNeedBeds(e.target.checked)}
                />{" "}
                Request Beds
              </label>
              <input
                type="number"
                min={1}
                value={bedsQty}
                disabled={!needBeds}
                onChange={(e) =>
                  setBedsQty(Math.max(1, Number(e.target.value)))
                }
                className="qty-input"
              />
            </div>

            <div className="form-row">
              <label>Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={submitRequest}
                disabled={requesting}
              >
                {requesting ? "Submitting..." : "Submit Request"}
              </button>
              <button
                className="btn btn-outline"
                onClick={closeModal}
                disabled={requesting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
