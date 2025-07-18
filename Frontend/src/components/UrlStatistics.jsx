import { useEffect, useState } from "react";


export default function UrlStatistics(){
    const [urls, setUrls] = useState([]);

    useEffect(() =>{
        const storedUrls = JSON.parse(localStorage.getItem("Urls")||"[]");
        setUrls(storedUrls);
    },[]);

    return(
        <div className="stat-container">
            <h2 className="stat-title">URL Shortener Statics</h2>
            {urls.length === 0 ? (
                <p className="stat-empty"> No shortened URLs found yet</p>
            ):(
                urls.map((url, idx) =>(
                    <div key={idx} className="stat-card">
                        <p><b>short URl</b>{window.location.origin}/{url.shortcode}</p>
                        <p><b>Original URL: </b>{url.original}</p>
                        <p><b>Created At:</b>{new Date(url.createdAt).toLocaleString()}</p>
                        <p><b>Expires At:</b>{new Date(url.expiresAt).toLocaleString()}</p>
                        <p><b>Total Clicks:</b>{url.clicks.length}</p>
                        {url.clicks.length > 0 && (
                            <>
                            <p><b>Click Details:</b></p>
                            <table className="stat-table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Source</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {url.clicks.map((click , i) =>(
                                        <tr key={i}>
                                            <td>{new Date(click.timestamp).toLocaleString()}</td>
                                            <td>{click.referrer||"Direct"}</td>
                                            <td>{click.location || "Unknown"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}