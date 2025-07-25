import React, { useEffect, useState } from 'react';
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { useRequestType, useConsumerStatus } from '../hooks';

interface RequestTrackerFilterPanelProps {
  currentFilters: {
    status: string;
    requestType: string;
  };
  onApplyFilters: (filters: { status?: string; requestType?: string }) => void;
  onResetFilters: () => void;
  remoteUtilityId: string | number;
}

export const RequestTrackerFilterPanel: React.FC<RequestTrackerFilterPanelProps> = ({
  currentFilters,
  onApplyFilters,
  onResetFilters,
  remoteUtilityId,
}) => {
  const { data: statusData } = useConsumerStatus({ remote_utility_id: String(remoteUtilityId) });
  const { data: typeData } = useRequestType({ remote_utility_id: String(remoteUtilityId) });

  const statuses = statusData?.result || [];
  const requestTypes = typeData?.result || [];

  const [tempFilters, setTempFilters] = useState({
    status: currentFilters.status || '',
    requestType: currentFilters.requestType || '',
  });

  useEffect(() => {
    setTempFilters({
      status: currentFilters.status || '',
      requestType: currentFilters.requestType || '',
    });
  }, [currentFilters]);

  const handleStatusChange = (value: string) => {
    setTempFilters((prev) => ({ ...prev, status: value === 'ALL_STATUS' ? '' : value }));
  };

  const handleTypeChange = (value: string) => {
    setTempFilters((prev) => ({ ...prev, requestType: value === 'ALL_TYPES' ? '' : value }));
  };

  const handleApply = () => {
    const filtersToApply: { status?: string; requestType?: string } = {};
    
    if (tempFilters.status) {
      filtersToApply.status = tempFilters.status;
    }
    
    if (tempFilters.requestType) {
      filtersToApply.requestType = tempFilters.requestType;
    }
    
    onApplyFilters(filtersToApply);
  };

  const handleReset = () => {
    setTempFilters({ status: '', requestType: '' });
    onResetFilters();
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleApply(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select 
            value={tempFilters.status || 'ALL_STATUS'} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL_STATUS">All Statuses</SelectItem>
                {statuses.map((status: any) => (
                  <SelectItem key={status.key} value={String(status.key)}>
                    {status.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Request Type</Label>
          <Select 
            value={tempFilters.requestType || 'ALL_TYPES'} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL_TYPES">All Types</SelectItem>
                {requestTypes.map((type: any) => (
                  <SelectItem key={type.key} value={type.key}>
                    {type.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button type="submit">
            Apply Filters
          </Button>
        </div>
      </div>
    </form>
  );
};