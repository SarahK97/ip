import React, {useState,useEffect} from 'react';
import axios from 'axios';
import RequestTable from './RequestTable';

const RequestList = ({ server }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get(server + '/requests')
        .then(res => {
          const requests = res.data;
          setRequests(requests);
        })
  }, [])

  return (
    <div>
      {
        requests
          .map(request =>
            <div key={request.id}>
                <RequestTable obj={request}/>
            </div>
          )
      }
    </div>
  )
}

export default RequestList;