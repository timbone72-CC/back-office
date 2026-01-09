import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import ClientProfiles from "./ClientProfiles";

import ClientDetail from "./ClientDetail";

import JobEstimates from "./JobEstimates";

import ScheduleLeads from "./ScheduleLeads";

import EstimateDetail from "./EstimateDetail";

import ScheduleLeadDetail from "./ScheduleLeadDetail";

import Calculators from "./Calculators";

import MaterialProcurement from "./MaterialProcurement";

import DataImport from "./DataImport";

import JobDetail from "./JobDetail";

import Inventory from "./Inventory";

import Portfolio from "./Portfolio";

import JobKits from "./JobKits";

import SystemLogs from "./SystemLogs";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    ClientProfiles: ClientProfiles,
    
    ClientDetail: ClientDetail,
    
    JobEstimates: JobEstimates,
    
    ScheduleLeads: ScheduleLeads,
    
    EstimateDetail: EstimateDetail,
    
    ScheduleLeadDetail: ScheduleLeadDetail,
    
    Calculators: Calculators,
    
    MaterialProcurement: MaterialProcurement,
    
    DataImport: DataImport,
    
    JobDetail: JobDetail,
    
    Inventory: Inventory,
    
    Portfolio: Portfolio,
    
    JobKits: JobKits,
    
    SystemLogs: SystemLogs,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/ClientProfiles" element={<ClientProfiles />} />
                
                <Route path="/ClientDetail" element={<ClientDetail />} />
                
                <Route path="/JobEstimates" element={<JobEstimates />} />
                
                <Route path="/ScheduleLeads" element={<ScheduleLeads />} />
                
                <Route path="/EstimateDetail" element={<EstimateDetail />} />
                
                <Route path="/ScheduleLeadDetail" element={<ScheduleLeadDetail />} />
                
                <Route path="/Calculators" element={<Calculators />} />
                
                <Route path="/MaterialProcurement" element={<MaterialProcurement />} />
                
                <Route path="/DataImport" element={<DataImport />} />
                
                <Route path="/JobDetail" element={<JobDetail />} />
                
                <Route path="/Inventory" element={<Inventory />} />
                
                <Route path="/Portfolio" element={<Portfolio />} />
                
                <Route path="/JobKits" element={<JobKits />} />
                
                <Route path="/SystemLogs" element={<SystemLogs />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}