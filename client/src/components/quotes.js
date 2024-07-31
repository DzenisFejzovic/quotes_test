import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./quoteStyle.css";
import arrow from "./pics/quoteArrow.png";
import upvote from "./pics/quoteArrowUp.png";
import downvote from "./pics/quoteArrowDown.png";

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotes = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/quotes", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data && Array.isArray(response.data.quotes)) {
          setQuotes(response.data.quotes);
        } else {
          console.error("Expected 'quotes' array but received:", response.data);
          setQuotes([]); // Handle unexpected data
        }
      } catch (err) {
        console.error("Failed to fetch quotes", err);
        setQuotes([]); // Handle fetch errors
      }
    };

    fetchQuotes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const toggleUpvote = async (id, hasUpvoted, hasDownvoted) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      if (hasDownvoted) {
        await axios.delete(`http://localhost:8000/quotes/${id}/downvote`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      if (hasUpvoted) {
        await axios.delete(`http://localhost:8000/quotes/${id}/upvote`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === id
              ? {
                  ...quote,
                  givenVote: null,
                  upvotesCount: quote.upvotesCount - 1,
                  downvotesCount: hasDownvoted
                    ? quote.downvotesCount - 1
                    : quote.downvotesCount,
                }
              : quote
          )
        );
      } else {
        await axios.post(
          `http://localhost:8000/quotes/${id}/upvote`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === id
              ? {
                  ...quote,
                  givenVote: "upvote",
                  upvotesCount: quote.upvotesCount + 1,
                  downvotesCount: hasDownvoted
                    ? quote.downvotesCount - 1
                    : quote.downvotesCount,
                }
              : quote
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle upvote", err);
    }
  };

  const toggleDownvote = async (id, hasUpvoted, hasDownvoted) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      if (hasUpvoted) {
        await axios.delete(`http://localhost:8000/quotes/${id}/upvote`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      if (hasDownvoted) {
        await axios.delete(`http://localhost:8000/quotes/${id}/downvote`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === id
              ? {
                  ...quote,
                  givenVote: null,
                  downvotesCount: quote.downvotesCount - 1,
                  upvotesCount: hasUpvoted
                    ? quote.upvotesCount - 1
                    : quote.upvotesCount,
                }
              : quote
          )
        );
      } else {
        await axios.post(
          `http://localhost:8000/quotes/${id}/downvote`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === id
              ? {
                  ...quote,
                  givenVote: "downvote",
                  downvotesCount: quote.downvotesCount + 1,
                  upvotesCount: hasUpvoted
                    ? quote.upvotesCount - 1
                    : quote.upvotesCount,
                }
              : quote
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle downvote", err);
    }
  };

  const calculateLikeDislikeRatio = (upvotes, downvotes) => {
    const total = upvotes + downvotes;
    return total === 0 ? "0%" : `${Math.round((upvotes / total) * 100)}%`;
  };

  const getColorClass = (ratio) => {
    if (ratio === "0%") return "black";
    const percentage = parseInt(ratio, 10);
    if (percentage >= 80) return "green";
    if (percentage >= 60) return "greenyellow";
    if (percentage >= 40) return "orange";
    if (percentage >= 20) return "lightcoral";
    if (percentage >= 0) return "red";
    return "black";
  };

  return (
    <div>
      <div className="background"></div>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="centerForCenter">
        <div className="centerQuotes">
          <div>
            <h1 className="titleQuote">Quotes</h1>
            {Array.isArray(quotes) ? (
              <ul className="quoteList">
                {quotes.map((quote) => (
                  <div key={quote.id} className="quote">
                    <div>
                      <p className="quoteText">"{quote.content}"</p>
                      <p className="quoteAuthor">— {quote.author}</p>
                      <div className="quoteButtons">
                        <img
                          src={quote.givenVote === "upvote" ? upvote : arrow}
                          className="upvote"
                          alt="logo"
                          onClick={() =>
                            toggleUpvote(
                              quote.id,
                              quote.givenVote === "upvote",
                              quote.givenVote === "downvote"
                            )
                          }
                        />
                        <p className="upvoteNumber">-{quote.upvotesCount}</p>
                        <span
                          className="likeDislikeRatio"
                          style={{
                            color: getColorClass(
                              calculateLikeDislikeRatio(
                                quote.upvotesCount,
                                quote.downvotesCount
                              )
                            ),
                          }}
                        >
                          {calculateLikeDislikeRatio(
                            quote.upvotesCount,
                            quote.downvotesCount
                          )}
                        </span>
                        <p className="downvoteNumber">
                          -{quote.downvotesCount}
                        </p>
                        <img
                          src={
                            quote.givenVote === "downvote" ? downvote : arrow
                          }
                          className="downvote"
                          alt="logo"
                          onClick={() =>
                            toggleDownvote(
                              quote.id,
                              quote.givenVote === "upvote",
                              quote.givenVote === "downvote"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No quotes available or data is not in the expected format.</p>
            )}

            <div className="Footer">
              <p className="FooterText">copyright 2024, All rights reserved.</p>
              <p className="FooterText">
                Created by:{" "}
                <a href="https://github.com/DzenisFejzovic">Dzenis fejzovic</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quotes;
