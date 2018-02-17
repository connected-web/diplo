import React, { Component } from 'react';
import './Assets.css';

class Assets extends Component {
  render() {
    const model = this.props.model

    function renderAssets(assets) {
      assets = assets || []

      function renderAsset(data) {
        return (
          <div key={data.id}>
            <h3>{data.id}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div class="asset border" style={{backgroundImage: `url('/api/assets/${data.id}`}}></div>
          </div>
        )
      }

      return assets.map(renderAsset)
    }

    return (
      <div className="Assets">
        <h1>Asset Viewer</h1>
        {renderAssets(model.data.assets)}
      </div>
    );
  }
}

export default Assets;
