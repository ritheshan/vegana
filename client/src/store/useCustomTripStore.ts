import { create } from 'zustand';
import { CustomTripRequest, CustomProposal } from '../types';
import { INITIAL_CUSTOM_TRIPS } from '../constants';

interface CustomTripState {
  requests: CustomTripRequest[];
  createRequest: (request: CustomTripRequest) => void;
  addProposal: (requestId: string, proposal: CustomProposal) => void;
  updateProposalStatus: (requestId: string, proposalId: string, status: 'accepted' | 'rejected') => void;
}

export const useCustomTripStore = create<CustomTripState>((set) => ({
  requests: INITIAL_CUSTOM_TRIPS,

  createRequest: (request) => {
    set((state) => ({ requests: [request, ...state.requests] }));
  },

  addProposal: (requestId, proposal) => {
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'responded',
            proposals: [...req.proposals, proposal]
          };
        }
        return req;
      })
    }));
  },

  updateProposalStatus: (requestId, proposalId, status) => {
    set((state) => ({
      requests: state.requests.map((req) => {
        if (req.id === requestId) {
          const updatedProposals = req.proposals.map((prop) => {
            if (prop.id === proposalId) {
              return { ...prop, status };
            }
            // If this proposal is accepted, reject all others automatically
            if (status === 'accepted' && prop.id !== proposalId) {
              return { ...prop, status: 'rejected' as const };
            }
            return prop;
          });

          return {
            ...req,
            status: status === 'accepted' ? ('accepted' as const) : ('rejected' as const),
            proposals: updatedProposals
          };
        }
        return req;
      })
    }));
  }
}));
