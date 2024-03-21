import React, { useState, useEffect } from "react";
import {
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  Typography,
} from "@mui/material";
import { ShoppingCart, Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./navbaradmin.module.css";
import Image from "next/image";

const AdminNavbar = ({ setIsAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const router = useRouter();
  const { adminroute } = router.query;

  const handleMobileMenuOpen = (event) => {
    setIsMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setIsMenuClosing(true);

    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 500);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    setWindowWidth(window.innerWidth);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          {/* Doradi className={classNames(styles.menuButton)} */}
          {windowWidth < 980 ? (
            <div className={styles.growAlt}>
           

              <Image
                    src="/images/menuIcon2.png"
                    onClick={handleMobileMenuOpen}
                    alt="Gamebuff"
                    height={24}
                    width={24}
                    className={styles.menuIcon}
                  />



              <Link
                href="/admin"
                style={{ marginLeft: "10px" }}
                className="text_decoration_none"
              >
                <div
                  className={styles.title}
                  
                >
                  <Image
                    src="/images/hackerLight2.png"
                    alt="Gamebuff"
                    height={24}
                    width={24}
                    className={styles.image}
                  />
                  
                  Welcome Admin!
                </div>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/admin" className="text_decoration_none">
                <h1 className={styles.title}>
                <Image
                    src="/images/hackerLight2.png"
                    alt="Gamebuff"
                    height={24}
                    width={24}
                    className={styles.image}
                  />
                  Welcome Admin!
                </h1>
              </Link>
              <div className={styles.grow}>
                <Link
                  href="/admin"
                  className={`${styles.linkStyle} ${
                    !adminroute ? styles.currentLink : ""
                  }`}
                >
                  Admin Home
                </Link>
                <Link
                  href="/admin/inbox"
                  className={`${styles.linkStyle} ${
                    adminroute === "inbox" ? styles.currentLink : ""
                  }`}
                >
                  Inbox
                </Link>
                <Link
                  href="/admin/orders"
                  className={`${styles.linkStyle} ${
                    adminroute === "orders" ? styles.currentLink : ""
                  }`}
                >
                  Orders
                </Link>
                <Link
                  href="/admin/subscribers"
                  className={`${styles.linkStyle} ${
                    adminroute === "subscribers" ? styles.currentLink : ""
                  }`}
                >
                  Subscribers
                </Link>
                <Link
                  href="/admin/reviews"
                  className={`${styles.linkStyle} ${
                    adminroute === "reviews" ? styles.currentLink : ""
                  }`}
                >
                  Reviews
                </Link>
                <Link
                  href="/admin/emails"
                  className={`${styles.linkStyle} ${
                    adminroute === "emails" ? styles.currentLink : ""
                  }`}
                >
                  Emails
                </Link>
                <Link
                  href="/admin/datawiper"
                  className={`${styles.linkStyle} ${
                    adminroute==="datawiper" ? styles.currentLink : ""
                  }`}
                >
                  Data wiper
                </Link>
              </div>
            </>
          )}

          <div
            className={styles.cartStyle}
           
            onClick={async () => {
              const response = await fetch("/api/adminlog", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  logout: true,
                }),
              });
              const data = await response.json();
              if (data.success) setIsAdmin(false);
              else {
                console.error("Logout failed:", data.error);
              }
            }}
          >
            Logout
          </div>
        </Toolbar>
      </nav>

      {isMenuOpen && (
        <div
          className={
            styles.mobileMenu +
            " " +
            (isMenuClosing ? styles.menuCoverDissapear : "")
          }
          onClick={handleMobileMenuClose}
        >
          <div
            className={
              styles.mainMenuCard +
              " " +
              (isMenuClosing ? styles.menuClose : "")
            }
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <button
                className={styles.menuItem_x_button}
                onClick={handleMobileMenuClose}
              >
                <Typography
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  variant="body1"
                >
                  x
                </Typography>
              </button>
            </MenuItem>

            <Link
              href="/admin"
              className={`${styles.linkStyle} ${
                !adminroute ? styles.currentLink : ""
              }`}
              onClick={() => {
                adminroute && setIsMenuOpen(false);
              }}
            >
              <MenuItem>
                <Typography variant="body1">Home</Typography>
              </MenuItem>
            </Link>

            <Link
              href="/admin/orders"
              className={`${styles.linkStyle} ${
                adminroute === "orders" ? styles.currentLink : ""
              }`}
              onClick={() => {
                adminroute !== "orders" && setIsMenuOpen(false);
              }}
            >
              <MenuItem>
                <Typography variant="body1">Orders</Typography>
              </MenuItem>
            </Link>
            <Link
              href="/admin/inbox"
              className={`${styles.linkStyle} ${
                adminroute === "inbox" ? styles.currentLink : ""
              }`}
              onClick={() => {
                adminroute && setIsMenuOpen(false);
              }}
            >
              <MenuItem>
                <Typography variant="body1">Inbox</Typography>
              </MenuItem>
            </Link>
            <Link
              href="/admin/subscribers"
              className={`${styles.linkStyle} ${
                adminroute === "subscribers" ? styles.currentLink : ""
              }`}
              onClick={() => {
                adminroute !== "subscribers" && setIsMenuOpen(false);
              }}
            >
              <MenuItem>
                <Typography variant="body1">Subscribers</Typography>
              </MenuItem>
            </Link>
            <Link
              href="/admin/reviews"
              className={`${styles.linkStyle} ${
                adminroute === "reviews" ? styles.currentLink : ""
              }`}
              onClick={() => {
                adminroute !== "reviews" && setIsMenuOpen(false);
              }}
            >
              <MenuItem>
                <Typography variant="body1">Reviews</Typography>
              </MenuItem>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
