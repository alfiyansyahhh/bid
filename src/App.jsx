import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { ClientJS } from "clientjs";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dalam komponen React Anda
  const path = window.location.pathname;
  const valueAfterSlash = path.substring(1); // Menghapus garis miring pertama ("/")

  // Fungsi untuk menghasilkan fingerprint
  const generateFingerprint = () => {
    const client = new ClientJS();
    return client.getFingerprint();
  };

  const [formData, setFormData] = useState({
    // inisialisasi state untuk data form
    browserId: generateFingerprint(),
    keterangan: "",
  });

  // Fungsi untuk melakukan fetch data
  const fetchData = async () => {
    try {
      // Mengambil data dari API menggunakan fetch
      const response = await fetch(
        `https://strapi-z8q3.onrender.com/api/browser-ids?_sort=createdAt:DESC`
      );
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari API");
      }
      const result = await response.json();
      generateFingerprint();
      setData(result.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mengirim data form ke API
      const response = await fetch(
        "https://strapi-z8q3.onrender.com/api/browser-ids",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: formData }), // mengirim data dalam format JSON sesuai permintaan Anda
        }
      );

      if (response.ok) {
        // Jika response OK, dapatkan data dari response
        const data = await response.json();
        fetchData();
        console.log("Data berhasil dikirim:", data);
        // Lakukan aksi lain setelah data berhasil dikirim
      } else {
        // Jika response tidak OK, handle error
        console.error("Gagal mengirim data:", response);
      }
    } catch (error) {
      // Handle error ketika fetch gagal
      console.error("Gagal fetch data:", error);
    }
  };

  const handleChange = useCallback((event) => {
    // Mengubah state formData saat input form berubah
    setFormData({
      browserId: generateFingerprint(),
      keterangan: event.target.value,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginRight: "30px",
            alignItems: "start",
            textAlign: "start",
          }}
        >
          {/* <p>BrowserId </p> */}
          <h1>{generateFingerprint()}</h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "start",
              justifyContent: "start",
            }}
          >
            <form onSubmit={handleSubmit}>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "start",
                }}
              >
                Keterangan:
                <input
                  type="text"
                  style={{
                    height: "100px",
                  }}
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleChange}
                />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
            <br />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "start" }}>
        {/* Menampilkan data yang telah diambil dari API */}
        <h1>Table</h1>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <table>
          <thead>
            <tr>
              <th style={{ paddingRight: "106px" }}>No</th>
              <th style={{ paddingRight: "106px" }}>Browser ID</th>
              <th style={{ paddingRight: "106px" }}>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} style={{ textAlign: "start" }}>
                <td>{index + 1}</td>
                <td>{item.attributes.browserId}</td>
                <td>{item.attributes.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
