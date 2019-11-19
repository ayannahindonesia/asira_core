import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getUserFunction } from './saga'
import { getAllRoleFunction } from '../rolePermission/saga';
import { getToken } from '../index/token';
import GridDetail from '../subComponent/GridDetail';
import { formatNumber, handleFormatDate } from '../global/globalFunction';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class CalonNasabahDetail extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      dataUser: {},
      calonNasabahId: 0,
      disabled: true,
      loading: true,
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        calonNasabahId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {};
      param.calonNasabahId = this.state.calonNasabahId;

      const data = await getUserFunction(param, getAllRoleFunction);
      

      if(data) {
          if(!data.error) {
            const dataUser = data.dataUser || {};

            this.setState({
              dataUser,
              listRole: data.dataRole,
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: data.error,
              disabled: true,
              loading: false,
            })
          }      
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listCalonNasabah'/>            
        } else if (this.state.loading){
          return  (
            <div  key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(getToken()){
            return(
              <div className="container mt-4">
                <h3>Calon Nasabah - Detail</h3>
                
                <hr/>
                 
                <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                  {this.state.errorMessage}
                </div>   

                <GridDetail
                  gridLabel={[4,5,7]}
                  background
                  label={[
                    ['Id Nasabah','Bank Nasabah'],
                    ['Kategori','Agen / AE'],
                    ['Tanggal Register'],
                  ]}
                  data={this.state.dataUser && [
                    [
                      this.state.dataUser.id, 
                      this.state.dataUser.bank_name
                    ],
                    [
                      this.state.dataUser.kategori,
                      this.state.dataUser.agency_provider,
                    ],
                    [
                      handleFormatDate(this.state.dataUser.created_time)
                    ],
                  ]}                 
                />

                <GridDetail
                  title="Informasi Pribadi"
                  gridLabel={[4,5,7]}
                  label={[
                    ['Nama','Jenis Kelamin','No KTP','No NPWP','Email'],
                    ['Tanggal Lahir','Tempat Lahir','Pendidikan','Nama Ibu Kandung','No HP'],
                    ['Status Pernikahan','Nama Pasangan','Tanggal Lahir Pasangan','Pendidikan Pasangan','Tanggungan (orang)'],
                  ]}
                  data={this.state.dataUser && [
                    [
                      this.state.dataUser.fullname, 
                      this.state.dataUser.gender && this.state.dataUser.gender === 'M' ? 'Pria' : 'Perempuan',
                      this.state.dataUser.idcard_number,
                      this.state.dataUser.taxid_number,
                      this.state.dataUser.email
                    ],
                    [
                      handleFormatDate(this.state.dataUser.birthday),
                      this.state.dataUser.birthplace,
                      this.state.dataUser.last_education,
                      this.state.dataUser.mother_name,
                      this.state.dataUser.phone
                    ],
                    [
                      this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? 'Menikah' : 'Belum Menikah',
                      this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? this.state.dataUser.spouse_name : '-',
                      this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? ((this.state.dataUser.spouse_birthday && handleFormatDate(this.state.dataUser.spouse_birthday)) || '-') : '-',
                      this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? this.state.dataUser.spouse_lasteducation : '-',
                      this.state.dataUser.dependants
                    ],
                  ]}                 
                />

                <GridDetail
                  title="Data Tempat Tinggal"
                  gridLabel={[4,5,7]}
                  label={[
                    ['Alamat','Provinsi','Kota','RT / RW','No Telp Rumah'],
                    ['Kecamatan','Kelurahan','Status Tempat Tinggal','Lama Menempati Rumah'],
                    [],
                  ]}
                  data={this.state.dataUser && [
                    [
                      this.state.dataUser.address, 
                      this.state.dataUser.province,
                      this.state.dataUser.city,
                      `${this.state.dataUser.neighbour_association} / ${this.state.dataUser.hamlets} `,
                      this.state.dataUser.home_phonenumber
                    ],
                    [
                      this.state.dataUser.subdistrict,
                      this.state.dataUser.urban_village,
                      this.state.dataUser.home_ownership,
                      `${this.state.dataUser.lived_for} bulan`,
                    ],
                    [],
                  ]}                 
                />

                <GridDetail
                  title="Info Pekerjaan"
                  gridLabel={[4,5,7]}
                  label={[
                    ['Jenis Pekerjaan','No Induk Pegawai','Nama Instansi','Alamat Kantor'],
                    ['Jabatan','Lama Bekerja','Nama Atasan','No Tlp Kantor'],
                    ['Gaji (perbulan)','Pendapatan Lain','Sumber Pendapatan Lain',],
                  ]}
                  data={this.state.dataUser && [
                    [
                      this.state.dataUser.field_of_work, 
                      this.state.dataUser.employee_id,
                      this.state.dataUser.employer_name,
                      this.state.dataUser.employer_address
                    ],
                    [
                      this.state.dataUser.occupation,
                      `${this.state.dataUser.been_workingfor} bulan`,
                      this.state.dataUser.direct_superiorname,
                      this.state.dataUser.employer_number,
                    ],
                    [
                      `Rp ${formatNumber(this.state.dataUser.monthly_income,true)}`,
                      `Rp ${formatNumber(this.state.dataUser.other_income,true)}`,
                      this.state.dataUser.other_incomesource,
                    ],
                  ]}                 
                />

                <GridDetail
                  title="Lain lain"
                  gridLabel={[7]}
                  label={[
                    ['Nama Orang Tidak Serumah Yang Bisa Dihubungi','Hubungan','Alamat Rumah','No Tlp','No HP'],
                    []
                  ]}
                  data={this.state.dataUser && [
                    [
                      this.state.dataUser.related_personname, 
                      this.state.dataUser.related_relation, 
                      this.state.dataUser.related_address,
                      this.state.dataUser.related_homenumber,
                      this.state.dataUser.related_phonenumber
                    ],
                    []
                  ]}                 
                />


                    
                <div className="col-sm-12">
                  <input type="button" value="Batal" className="btn" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                </div>
                    
                    
                 
                
              </div>
            )
        } else if(!getToken()){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // fetching: getFetchStatus(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(CalonNasabahDetail);