// // src/hooks/useTeams.ts
// import { useState, useEffect } from 'react';
// import { Team } from '../types';
// import { teamsAPI } from '../services/api';
// import toast from 'react-hot-toast';
// export const useTeams = () => {
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const fetchTeams = async () => {
//     try {
//       setLoading(true);
//       const response = await teamsAPI.getTeams();
//       setTeams(response.teams);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message);
//       toast.error('Failed to fetch teams');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const createTeam = async (teamData: { name: string; members: any[] }) => {
//     try {
//       const response = await teamsAPI.createTeam(teamData);
//       setTeams(prev => [...prev, response.team]);
//       toast.success('Team created successfully');
//       return response.team;
//     } catch (err: any) {
//       toast.error('Failed to create team');
//       throw err;
//     }
//   };
//   const deleteTeam = async (id: string) => {
//     try {
//       await teamsAPI.deleteTeam(id);
//       setTeams(prev => prev.filter(team => team._id !== id));
//       toast.success('Team deleted successfully');
//     } catch (err: any) {
//       toast.error('Failed to delete team');
//       throw err;
//     }
//   };
//   useEffect(() => {
//     fetchTeams();
//   }, []);
//   return {
//     teams,
//     loading,
//     error,
//     fetchTeams,
//     createTeam,
//     deleteTeam,
//   };
// };
// src/hooks/useTeams.ts
import { useState, useEffect } from 'react';
import { teamsAPI } from '../services/api';
import toast from 'react-hot-toast';
export const useTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchTeams = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await teamsAPI.getTeams();
            console.log('Fetched teams:', response.teams); // Debug log
            setTeams(response.teams || []);
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch teams';
            setError(errorMessage);
            toast.error(errorMessage);
            setTeams([]); // Reset to empty array on error
        }
        finally {
            setLoading(false);
        }
    };
    const createTeam = async (teamData) => {
        try {
            const response = await teamsAPI.createTeam(teamData);
            setTeams(prev => [...prev, response.team]);
            toast.success('Team created successfully');
            return response.team;
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create team';
            toast.error(errorMessage);
            throw err;
        }
    };
    const updateTeam = async (id, teamData) => {
        try {
            const response = await teamsAPI.updateTeam(id, teamData);
            setTeams(prev => prev.map(team => team._id === id ? response.team : team));
            toast.success('Team updated successfully');
            return response.team;
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update team';
            toast.error(errorMessage);
            throw err;
        }
    };
    const deleteTeam = async (id) => {
        try {
            await teamsAPI.deleteTeam(id);
            setTeams(prev => prev.filter(team => team._id !== id));
            toast.success('Team deleted successfully');
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete team';
            toast.error(errorMessage);
            throw err;
        }
    };
    useEffect(() => {
        fetchTeams();
    }, []);
    return {
        teams,
        loading,
        error,
        fetchTeams,
        createTeam,
        updateTeam,
        deleteTeam,
        refetch: fetchTeams, // Add refetch function
    };
};
