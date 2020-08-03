import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import MDropdown from 'components/ui/MDropdown';
import {
  string,
  shape,
  number,
  arrayOf,
} from 'prop-types';
import AuthWrapper from 'components/AuthWrapper';
import { PROJECT_TYPES } from 'domain/project/projectTypes';

export class RepoFeatures extends Component {
  constructor(props) {
    super(props);
    const {
      projectId,
    } = this.props;

    this.state = {
      projectId,
      branches: [],
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const newState = { ...prevState };
    newState.branches = nextProps.branches;

    newState.branchSelected = nextProps.branch !== prevState.branchSelected
      ? nextProps.branch
      : newState.branchSelected;

    return newState;
  }

  componentWillUnmount() {
    this.setState = (state) => (state);
  }

  render() {
    const {
      projects: {
        selectedProject: {
          namespace,
          slug,
        },
      },
      codeProjectButtonColor,
    } = this.props;

    const {
      projectId,
      branches,
    } = this.state;

    const { branch: currentBranch, path, searchableType } = this.props;

    const isCodeProject = searchableType === PROJECT_TYPES.CODE_PROJ
      || searchableType === PROJECT_TYPES.CODE;

    return (
      <div id="repo-features">

        <MDropdown
          className="mr-2 mt-3"
          label={decodeURIComponent(currentBranch)}
          component={(
            <div id="branches-list" className="select-branch">
              <div
                style={{ margin: '0 50px', fontSize: '14px', padding: '0 40px' }}
              >
                <p>Switch Branches</p>
              </div>
              <hr />
              <div className="search-branch">
                <input
                  type="text"
                  placeholder="Search branches or tags"
                />
                <div className="branches">
                  <ul>
                    <li className="branch-header">Branches</li>
                    {branches && branches.filter((branch) => !branch.name.startsWith('data-pipeline/')
                      && !branch.name.startsWith('data-visualization/') && !branch.name.startsWith('experiment/')).map((branch) => {
                      const encoded = encodeURIComponent(branch.name);
                      return (
                        <li key={encoded}>
                          <Link
                            id={branch.name}
                            to={`/${namespace}/${slug}/-/tree/${encoded}`}
                          >
                            <p>{branch.name}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        />

        <MDropdown
          className="mr-2 mt-3"
          label={<i className="fa fa-plus" />}
          component={(
            <div className="plus-dropdown">
              <ul className="plus-list">
                <li>This directory</li>
                <li className="plus-option">
                  <Link to={{
                    pathname: `/my-projects/${projectId}/${currentBranch}/upload-file`,
                    state: { currentFilePath: path },
                  }}
                  >
                    Upload File
                  </Link>
                </li>
                <hr />
                <li>This repository</li>
                <li className="plus-option">
                  <Link to={`/${namespace}/${slug}/-/branches/new`}>
                    New branch
                  </Link>
                </li>
              </ul>
            </div>
          )}
        />

        {!isCodeProject && (
          <div>
            <AuthWrapper minRole={30} className="mr-2 mt-3">
              <Link
                className="btn btn-dark px-3 mr-2 mt-3"
                to={`/my-projects/${namespace}/${slug}/pipeline-execution/new-data-pipeline`}
              >
                Data Ops
              </Link>
            </AuthWrapper>

            <AuthWrapper
              minRole={30}
              className=""
            >
              <Link
                className="btn btn-dark px-3 mr-auto mt-3"
                to={`/my-projects/${namespace}/${slug}/pipeline-execution/new-data-visualisation`}
              >
                Data Visualisation
              </Link>
            </AuthWrapper>
          </div>
        )}

        {isCodeProject && (
          <button
            type="button"
            className="btn px-3 ml-2 mr-auto mt-3"
            style={{
              backgroundColor: codeProjectButtonColor,
              color: 'white',
            }}
          >
            Publish
          </button>
        )}
        <AuthWrapper
          resource={{ type: 'project' }}
          minRole={20}
          accountType={1}
        >
          <Link
            className="btn btn-outline-dark ml-auto mt-3"
            to={`/my-projects/${projectId}/${currentBranch}/commits/${path}`}
          >
            History
          </Link>
        </AuthWrapper>
      </div>
    );
  }
}

RepoFeatures.propTypes = {
  branch: string.isRequired,
  path: string.isRequired,
  projectId: number.isRequired,
  branches: arrayOf(
    shape({
      name: string.isRequired,
    }),
  ).isRequired,
  searchableType: string.isRequired,
};

function mapStateToProps(state) {
  return {
    projects: state.projects,
    branches: state.branches,
    codeProjectButtonColor: state.user.globalColorMarker,
  };
}

export default connect(mapStateToProps)(RepoFeatures);
