import React from "react";
import Header, { type HeaderProps } from "./Header";
import Sidebar, { type SidebarProps } from "./Sidebar";
import Footer from "./Footer";

export type LayoutProps = {
  children: React.ReactNode;
  header?: HeaderProps;
  sidebar?: SidebarProps;
  hideSidebar?: boolean;
  className?: string;
  /** Override the content column div class (e.g. omit `dcir__content`). Defaults to col + dcir__content. */
  contentClassName?: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  sidebar,
  hideSidebar = false,
  className = "",
  contentClassName,
}) => {
  const rootClasses = ["qld__djag__layout", className].filter(Boolean).join(" ");
  const defaultContentClass = `col-xs-12 ${
    hideSidebar ? "col-lg-12 col-xl-12" : "col-lg-9 col-xl-9"
  } dcir__content`;

  return (
    <div className={rootClasses}>
      <Header {...header} />

      <main className="main dcir" role="main">
        <section className="qld__body dcir">
          <div className="container-fluid dcir">
            <div className="row">
              {!hideSidebar && (
                <div className="col-xs-12 col-lg-3 col-xl-3 dcir__sidebar">
                  <Sidebar {...sidebar} />
                </div>
              )}

              <div
                className={contentClassName ?? defaultContentClass}
                id="content"
              >
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
