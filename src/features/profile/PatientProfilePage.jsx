import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../hooks/useAuth";
import { profileService } from "./data/profileService";
import {
  FiChevronDown,
  FiPhone,
  FiMail,
  FiCamera,
  FiUpload,
} from "react-icons/fi";
import "../../styles/profile-pages.css";

function createInitialFormData(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "Male",
    phone: user?.phone || "",
    email: user?.email || "",
    patientId: user?.patientId || user?.id || "",
    city: user?.city || "",
    avatar: user?.avatar || "",
  };
}

function mapPatientProfile(data, fallbackUser) {
  return {
    firstName: data?.firstName || fallbackUser?.firstName || "",
    lastName: data?.lastName || fallbackUser?.lastName || "",
    age: data?.age || fallbackUser?.age || "",
    gender: data?.gender || fallbackUser?.gender || "Male",
    phone: data?.phone || data?.phoneNumber || fallbackUser?.phone || "",
    email: data?.email || fallbackUser?.email || "",
    patientId: data?.patientId || data?.id || fallbackUser?.patientId || "",
    city: data?.city || data?.address || fallbackUser?.city || "",
    avatar: data?.avatar || fallbackUser?.avatar || "",
  };
}

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState(() => createInitialFormData(user));
  const [originalData, setOriginalData] = useState(() => createInitialFormData(user));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const data = await profileService.getProfile();
        const mappedProfile = mapPatientProfile(data, user);

        if (isMounted) {
          setFormData(mappedProfile);
          setOriginalData(mappedProfile);
        }
      } catch (err) {
        console.error("Load patient profile error:", err);

        if (isMounted) {
          const fallbackProfile = createInitialFormData(user);
          setFormData(fallbackProfile);
          setOriginalData(fallbackProfile);
          setError("Impossible de charger le profil patient.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        age: formData.age,
        gender: formData.gender,
        phoneNumber: formData.phone?.trim(),
        city: formData.city?.trim(),
        patientId: formData.patientId?.trim(),
        avatar: formData.avatar,
      };

      const updatedProfile = await profileService.completeProfile(payload);
      const mappedProfile = mapPatientProfile(updatedProfile, {
        ...user,
        ...formData,
      });

      setFormData(mappedProfile);
      setOriginalData(mappedProfile);
      setSuccess("Profil patient enregistré avec succès.");
    } catch (err) {
      console.error("Save patient profile error:", err);
      setError("Erreur lors de l’enregistrement du profil patient.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setFormData(originalData);
    setError("");
    setSuccess("");
  }

  function handleEditPhoto() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target.result,
        }));
      };

      reader.readAsDataURL(file);
    };

    input.click();
  }

  return (
    <DashboardShell title="Patient Profile" description="Profile">
      <div className="patient-profile-page">
        {loading && (
          <div className="profile-status-message">
            Chargement du profil...
          </div>
        )}

        {error && (
          <div className="profile-status-message profile-status-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-status-message profile-status-success">
            {success}
          </div>
        )}

        <div className="patient-profile-grid">
          <aside className="patient-profile-side-card">
            <div className="patient-profile-side-top">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Patient"
                  className="patient-profile-avatar"
                />
              ) : (
                <div className="patient-profile-avatar-fallback">
                  {formData.firstName?.[0] || "P"}
                </div>
              )}

              <h2 className="patient-profile-name">
                {formData.firstName || "Patient"}
                <br />
                {formData.lastName || ""}
              </h2>

              <p className="patient-profile-location">
                {formData.city || "Ville non renseignée"}
              </p>

              <button
                type="button"
                className="edit-photo-btn"
                onClick={handleEditPhoto}
                disabled={saving}
              >
                <FiCamera />
                Edit Photo
              </button>
            </div>

            <div className="patient-profile-side-decor" />
          </aside>

          <section className="patient-profile-main-card">
            <div className="patient-profile-header">
              <h2>Personal Information</h2>
              <p>Manage your basic details and medical information.</p>
            </div>

            <div className="patient-profile-divider" />

            <div className="patient-profile-section">
              <h3>Personal Information</h3>

              <div className="patient-profile-form-grid">
                <div className="patient-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="patient-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="patient-field select-field">
                  <label>Age</label>
                  <select
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Select age</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                    <option value="60">60</option>
                    <option value="61">61</option>
                    <option value="62">62</option>
                    <option value="63">63</option>
                    <option value="64">64</option>
                    <option value="65">65</option>
                    <option value="66">66</option>
                    <option value="67">67</option>
                    <option value="68">68</option>
                    <option value="69">69</option>
                    <option value="70">70</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>

                <div className="patient-field select-field">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>
              </div>

              <div className="patient-contact-block">
                <label className="block-label">Contact Information</label>

                <div className="patient-contact-grid">
                  <div className="patient-field icon-input-field">
                    <span className="input-icon-left">
                      <FiPhone />
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>

                  <div className="patient-field icon-input-field">
                    <span className="input-icon-left">
                      <FiMail />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="patient-profile-section">
              <h3>Medical ID / Patient Number</h3>

              <div className="patient-field single-field">
                <label>Medical ID / Patient Number</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="upload-block">
                <label>Latest Imaging Results</label>
                <button type="button" className="upload-btn" disabled={saving}>
                  <FiUpload />
                  Upload Document
                </button>
              </div>
            </div>

            <div className="patient-profile-footer-actions">
              <button
                type="button"
                className="auth-settings-btn"
                onClick={() => navigate("/settings")}
                disabled={saving}
              >
                Edit authentication info
              </button>

              <button
                type="button"
                className="discard-btn"
                onClick={handleDiscard}
                disabled={saving}
              >
                Discard Changes
              </button>

              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
                disabled={saving || loading}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}