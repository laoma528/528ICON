import { Component } from "react";
import Result from "./result.jsx";
import FilterGroup from "./FilterGroup.jsx";
import { lookupApp, parseAppStoreInput, searchApp } from "./searchApp.js";
import { getUrlArgs } from "./url.jsx";
import "./app.css";

const getSystemLang = () =>
  navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";

const isAndroid = /android/i.test(navigator.userAgent);

const TRANSLATIONS = {
  zh: {
    title: "528图标LOGO下载",
    description: "获取高清PNG应用图标logo",
    searchPlaceholder: "输入应用名称、App Store链接或 ID",
    filterToggle: "筛选条件",
    queryType: "查询类型",
    queryCount: "查询数量",
    region: "国家地区",
    cutMode: "裁切方式",
    cutCorner: "普通圆角",
    officialCorner: "官方圆角",
    originalImage: "原始图像",
    imageFormat: "图像格式",
    imageSize: "图像尺寸",
    langToggle: "切换语言",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "系统",
    noResults: "🔍 未找到相关应用",
    proxyWarning: "提示：可尝试切换国家/地区，或检查网络及代理设置",
    androidWarning: "检测到当前是Android设备，可使用",
    androidAppLink: "App版本",
  },
  en: {
    title: "528 Icon Helper",
    description: "Get high-quality PNG app icons and logos",
    searchPlaceholder: "App name, App Store link or ID",
    filterToggle: "Filter Options",
    queryType: "Platform",
    queryCount: "Results",
    region: "Region",
    cutMode: "Style",
    cutCorner: "Normal Rounded",
    officialCorner: "Official",
    originalImage: "Original",
    imageFormat: "Format",
    imageSize: "Size",
    langToggle: "Language",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "Auto",
    noResults: "🔍 No results found",
    proxyWarning: "Tip: Try another region or check your network and proxy settings",
    androidWarning: "Android device detected. You can use the",
    androidAppLink: "App version",
  },
};

const ENTITY_MAPS = [
  { key: "entity", value: "software", text: "iOS" },
  { key: "entity", value: "iPadSoftware", text: "iPadOS" },
  { key: "entity", value: "desktopSoftware", text: "macOS" },
];
const COUNTRY_MAPS = [
  { key: "country", value: "cn", text: "中国" },
  { key: "country", value: "us", text: "美国" },
  { key: "country", value: "jp", text: "日本" },
  { key: "country", value: "kr", text: "韩国" },
  { key: "country", value: "tw", text: "台湾" },
  { key: "country", value: "hk", text: "香港" },
  { key: "country", value: "sg", text: "新加坡" },
  { key: "country", value: "gb", text: "英国" },
  { key: "country", value: "fr", text: "法国" },
  { key: "country", value: "de", text: "德国" },
  { key: "country", value: "it", text: "意大利" },
  { key: "country", value: "es", text: "西班牙" },
  { key: "country", value: "ru", text: "俄罗斯" },
  { key: "country", value: "in", text: "印度" },
  { key: "country", value: "th", text: "泰国" },
  { key: "country", value: "id", text: "印尼" },
  { key: "country", value: "ph", text: "菲律宾" },
  { key: "country", value: "vn", text: "越南" },
  { key: "country", value: "tr", text: "土耳其" },
  { key: "country", value: "ca", text: "加拿大" },
  { key: "country", value: "au", text: "澳洲" },
  { key: "country", value: "br", text: "巴西" },
  { key: "country", value: "mx", text: "墨西哥" },
  { key: "country", value: "my", text: "马来西亚" },
];
const FORMAT_MAPS = [
  { key: "format", value: "jpeg", text: "JPEG" },
  { key: "format", value: "png", text: "PNG" },
  { key: "format", value: "webp", text: "WebP" },
];
const RESOLUTION_MAPS = [
  { key: "resolution", value: "256", text: "256px" },
  { key: "resolution", value: "512", text: "512px" },
  { key: "resolution", value: "1024", text: "1024px" },
];
const LIMIT_MAPS = [
  { key: "limit", value: "6", text: "6" },
  { key: "limit", value: "18", text: "18" },
  { key: "limit", value: "30", text: "30" },
  { key: "limit", value: "48", text: "48" },
];

const getCutMaps = (t) => [
  { key: "cut", value: "2", text: t.officialCorner },
  { key: "cut", value: "1", text: t.cutCorner },
  { key: "cut", value: "0", text: t.originalImage },
];

class App extends Component {
  constructor(props) {
    super(props);
    const systemLang = getSystemLang();
    const theme = localStorage.getItem("theme") || "system";
    const language = localStorage.getItem("language") || "system";
    const currentLang = language === "system" ? systemLang : language;
    const initialName = getUrlArgs("name") || "";

    this.state = {
      name: initialName,
      country:
        getUrlArgs("country") || parseAppStoreInput(initialName)?.country || "cn",
      entity: getUrlArgs("entity") || "software",
      limit: getUrlArgs("limit") || "18",
      cut:
        getUrlArgs("entity") === "desktopSoftware"
          ? "0"
          : getUrlArgs("cut") || "2",
      resolution: getUrlArgs("resolution") || "512",
      format: getUrlArgs("format") || "png",
      mobileCut:
        getUrlArgs("entity") === "desktopSoftware"
          ? "2"
          : getUrlArgs("cut") || "2",
      results: [],
      isSearching: false,
      hasSearched: !!initialName,
      isFiltersVisible: false,
      theme,
      language,
      currentLang,
      isControlsVisible: false,
    };

    this.search = this.search.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);

    this.draggedElement = null;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeftStart = 0;

    this.applyTheme(theme);
  }

  componentDidMount() {
    this.darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.darkModeMediaQuery.addEventListener(
      "change",
      this.handleSystemThemeChange,
    );

    // 点击外部关闭筛选框
    document.addEventListener("click", this.handleClickOutside);

    if (this.state.name) {
      this.search();
    }
  }

  componentWillUnmount() {
    this.darkModeMediaQuery?.removeEventListener(
      "change",
      this.handleSystemThemeChange,
    );
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("mousemove", this.handleDocumentMouseMove);
    document.removeEventListener("mouseup", this.handleDocumentMouseUp);
  }

  handleClickOutside = (event) => {
    const filtersContainer = event.target.closest('.filters-container');
    if (!filtersContainer && this.state.isFiltersVisible) {
      this.setState({ isFiltersVisible: false });
    }
  };

  applyTheme = (theme) => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light",
      );
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  handleSystemThemeChange = () => {
    this.applyTheme(this.state.theme);
  };

  handleSystemLanguageChange = () => {
    const { language } = this.state;
    this.setState({
      currentLang: language === "system" ? getSystemLang() : language,
    });
  };

  toggleTheme = (newTheme) => {
    this.setState({ theme: newTheme }, () => {
      localStorage.setItem("theme", newTheme);
      this.applyTheme(newTheme);
    });
  };

  handleFilterChange = (option, callback) => {
    this.setState({ [option.key]: option.value }, callback);
  };

  toggleLanguage = (newLang) => {
    this.setState(
      {
        language: newLang,
        currentLang: newLang === "system" ? getSystemLang() : newLang,
      },
      () => {
        localStorage.setItem("language", newLang);
      },
    );
  };

  toggleFilters() {
    this.setState((prevState) => ({
      isFiltersVisible: !prevState.isFiltersVisible,
    }));
  }

  toggleControls = () => {
    this.setState((prevState) => ({
      isControlsVisible: !prevState.isControlsVisible,
    }));
  };

  async search() {
    const { name, country, entity, limit, cut, resolution, format } =
      this.state;
    const trimmedName = name.trim();
    if (!trimmedName) {
      this.setState({ results: [], hasSearched: false });
      const cleanUrl = window.location.href.split("?")[0];
      history.replaceState(null, null, cleanUrl);
      return;
    }

    const lookup = parseAppStoreInput(trimmedName);
    this.setState({ isSearching: true });
    try {
      const data = lookup
        ? await lookupApp(lookup.id, country)
        : await searchApp(trimmedName, country, entity, limit);
      const limitedResults = data.results.slice(0, parseInt(limit, 10));
      this.setState({
        results: limitedResults,
        isSearching: false,
        hasSearched: true,
      });

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("name", trimmedName);
      currentUrl.searchParams.set("country", country);
      currentUrl.searchParams.set("entity", entity);
      currentUrl.searchParams.set("limit", limit);
      currentUrl.searchParams.set("cut", cut);
      currentUrl.searchParams.set("resolution", resolution);
      currentUrl.searchParams.set("format", format);
      history.replaceState(null, null, currentUrl.toString());
    } catch (err) {
      console.error("Error:", err);
      this.setState({ results: [], isSearching: false, hasSearched: true });
    }
  }

  handleFilterOptionsMouseDown = (event) => {
    const el = event.currentTarget;
    this.draggedElement = el;
    this.isDragging = true;
    this.startX = event.pageX - el.offsetLeft;
    this.scrollLeftStart = el.scrollLeft;
    el.classList.add("grabbing");

    document.addEventListener("mousemove", this.handleDocumentMouseMove);
    document.addEventListener("mouseup", this.handleDocumentMouseUp);
    event.preventDefault();
  };

  handleDocumentMouseMove = (event) => {
    if (!this.isDragging || !this.draggedElement) return;
    event.preventDefault();
    const x = event.pageX - this.draggedElement.offsetLeft;
    const walk = (x - this.startX) * 1.5;
    this.draggedElement.scrollLeft = this.scrollLeftStart - walk;
  };

  handleDocumentMouseUp = () => {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.draggedElement) {
      this.draggedElement.classList.remove("grabbing");
    }
    this.draggedElement = null;

    document.removeEventListener("mousemove", this.handleDocumentMouseMove);
    document.removeEventListener("mouseup", this.handleDocumentMouseUp);
  };

  render() {
    const {
      name,
      cut,
      resolution,
      format,
      results,
      isSearching,
      hasSearched,
      isFiltersVisible,
      theme,
      language,
      currentLang,
      isControlsVisible,
    } = this.state;

    const t =
      TRANSLATIONS[language === "system" ? currentLang : language] ||
      TRANSLATIONS.en;

    const cutMaps = getCutMaps(t);
    const disabledCutValues =
      this.state.entity === "desktopSoftware" ? ["1", "2"] : [];

    return (
      <div className="app">
        <header>
          <div className="center">
            <div className="header-content">
              <div className="branding">
                <div className="logo">{t.title}</div>
                <div className="description">{t.description}</div>
              </div>
              <div className="header-right">
                <div className="header-controls">
                  <button
                    className="icon-button lang-icon"
                    onClick={this.toggleLanguage.bind(this, language === "zh" ? "en" : "zh")}
                    title={language === "zh" ? "Switch to English" : "切换到中文"}
                  >
                    {language === "zh" ? "中" : "EN"}
                  </button>
                  <button
                    className={`icon-button ${theme === "dark" ? "theme-icon-dark" : "theme-icon-light"}`}
                    onClick={this.toggleTheme.bind(this, theme === "dark" ? "light" : "dark")}
                    title={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
                  />
                </div>
                <div className="search">
                  <input
                    className="search-input"
                    placeholder={t.searchPlaceholder}
                    value={name}
                    onChange={(e) => {
                      const nextName = e.target.value;
                      const linkCountry = parseAppStoreInput(nextName)?.country;
                      this.setState({
                        name: nextName,
                        ...(linkCountry ? { country: linkCountry } : {}),
                      });
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" ? this.search() : null
                    }
                  />
                  <button
                    className={`search-button ${isSearching ? "loading" : ""}`}
                    onClick={this.search}
                    disabled={isSearching}
                  >
                    <div className="search-icon" />
                  </button>
                </div>
              </div>
            </div>
            <div className="filters-container">
              <button
                className={`filters-toggle ${isFiltersVisible ? "active" : ""}`}
                onClick={this.toggleFilters}
              >
                {t.filterToggle}
              </button>
              <div className={`filters ${isFiltersVisible ? "show" : ""}`}>
                <div className="filters-inner">
                  <FilterGroup
                    title={t.queryType}
                    options={ENTITY_MAPS}
                    currentValue={this.state.entity}
                    onChange={(option) => {
                      const newState = { entity: option.value };
                      if (option.value === "desktopSoftware") {
                        newState.cut = "0";
                      } else if (this.state.entity === "desktopSoftware") {
                        newState.cut = this.state.mobileCut;
                      }
                      this.setState(newState, this.search);
                    }}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.queryCount}
                    options={LIMIT_MAPS}
                    currentValue={this.state.limit}
                    onChange={(option) =>
                      this.handleFilterChange(option, this.search)
                    }
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.region}
                    options={COUNTRY_MAPS}
                    currentValue={this.state.country}
                    onChange={(option) =>
                      this.handleFilterChange(option, this.search)
                    }
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.cutMode}
                    options={cutMaps}
                    currentValue={this.state.cut}
                    onChange={(option) => {
                      const newState = { cut: option.value };
                      if (this.state.entity !== "desktopSoftware") {
                        newState.mobileCut = option.value;
                      }
                      this.setState(newState);
                    }}
                    disabledValues={disabledCutValues}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.imageFormat}
                    options={FORMAT_MAPS}
                    currentValue={this.state.format}
                    onChange={(option) => this.handleFilterChange(option)}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.imageSize}
                    options={RESOLUTION_MAPS}
                    currentValue={this.state.resolution}
                    onChange={(option) => this.handleFilterChange(option)}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="results">
          {isSearching ? (
            Array.from({ length: parseInt(this.state.limit, 10) }, (_, i) => (
              <div className="result skeleton" key={i}>
                <div className="icon-wrapper" />
                <div className="info">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-artist" />
                  <div className="skeleton-line skeleton-platform" />
                </div>
              </div>
            ))
          ) : results.length > 0 ? (
            results.map((result) => (
              <Result
                key={result.trackId}
                data={result}
                cut={cut}
                resolution={resolution}
                format={format}
              />
            ))
          ) : hasSearched ? (
            <div className="no-results">
              <div>{t.noResults}</div>
              <div className="proxy-warning">{t.proxyWarning}</div>
              {isAndroid && (
                <div className="android-warning">
                  {t.androidWarning}
                  <a
                    href="https://528.im"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.androidAppLink}
                  </a>
                </div>
              )}
            </div>
          ) : null}
        </main>
        <footer>
          <div className="center">
            <div className="footer-content">
              <div className="copyright">
                Copyright © 2024 - 2026{" "}
                <a href="https://528.im" target="_blank" rel="noopener noreferrer">528.im</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
