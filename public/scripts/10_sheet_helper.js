/*
 * Scene Suite 10 - Sheet Helper 0.6.33
 * 제작 및 통합: @EOOOOORK
 * 시트 HTML 인식: 공개 및 커스텀 시트 호환
 * 속성 변화 알림 참고: https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker
 */

var KIBScene = KIBScene || {};
var KIBSheetHelper = KIBSheetHelper || {};
var KIBSheetContracts = KIBSheetContracts || [];

/* SCENE_SUITE_SHEET_RECOGNITION_START */
(function () {
  /*!
   * Self-contained Brotli JSON decoder bundle
   *
   * This bundle includes code from brotli.js, base64-js, and the Browserify runtime.
   *
   * MIT License
   *
   * Copyright (c) Devon Govett
   * Copyright (c) 2014 Jameson Little
   * Copyright (c) 2010 James Halliday (mail@substack.net)
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   * Apache License
   * Version 2.0, January 2004
   * http://www.apache.org/licenses/
   *
   * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
   *
   * 1. Definitions.
   *
   * "License" shall mean the terms and conditions for use, reproduction,
   * and distribution as defined by Sections 1 through 9 of this document.
   *
   * "Licensor" shall mean the copyright owner or entity authorized by
   * the copyright owner that is granting the License.
   *
   * "Legal Entity" shall mean the union of the acting entity and all
   * other entities that control, are controlled by, or are under common
   * control with that entity. For the purposes of this definition,
   * "control" means (i) the power, direct or indirect, to cause the
   * direction or management of such entity, whether by contract or
   * otherwise, or (ii) ownership of fifty percent (50%) or more of the
   * outstanding shares, or (iii) beneficial ownership of such entity.
   *
   * "You" (or "Your") shall mean an individual or Legal Entity
   * exercising permissions granted by this License.
   *
   * "Source" form shall mean the preferred form for making modifications,
   * including but not limited to software source code, documentation
   * source, and configuration files.
   *
   * "Object" form shall mean any form resulting from mechanical
   * transformation or translation of a Source form, including but
   * not limited to compiled object code, generated documentation,
   * and conversions to other media types.
   *
   * "Work" shall mean the work of authorship, whether in Source or
   * Object form, made available under the License, as indicated by a
   * copyright notice that is included in or attached to the work
   * (an example is provided in the Appendix below).
   *
   * "Derivative Works" shall mean any work, whether in Source or Object
   * form, that is based on (or derived from) the Work and for which the
   * editorial revisions, annotations, elaborations, or other modifications
   * represent, as a whole, an original work of authorship. For the purposes
   * of this License, Derivative Works shall not include works that remain
   * separable from, or merely link (or bind by name) to the interfaces of,
   * the Work and Derivative Works thereof.
   *
   * "Contribution" shall mean any work of authorship, including
   * the original version of the Work and any modifications or additions
   * to that Work or Derivative Works thereof, that is intentionally
   * submitted to Licensor for inclusion in the Work by the copyright owner
   * or by an individual or Legal Entity authorized to submit on behalf of
   * the copyright owner. For the purposes of this definition, "submitted"
   * means any form of electronic, verbal, or written communication sent
   * to the Licensor or its representatives, including but not limited to
   * communication on electronic mailing lists, source code control systems,
   * and issue tracking systems that are managed by, or on behalf of, the
   * Licensor for the purpose of discussing and improving the Work, but
   * excluding communication that is conspicuously marked or otherwise
   * designated in writing by the copyright owner as "Not a Contribution."
   *
   * "Contributor" shall mean Licensor and any individual or Legal Entity
   * on behalf of whom a Contribution has been received by Licensor and
   * subsequently incorporated within the Work.
   *
   * 2. Grant of Copyright License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * copyright license to reproduce, prepare Derivative Works of,
   * publicly display, publicly perform, sublicense, and distribute the
   * Work and such Derivative Works in Source or Object form.
   *
   * 3. Grant of Patent License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * (except as stated in this section) patent license to make, have made,
   * use, offer to sell, sell, import, and otherwise transfer the Work,
   * where such license applies only to those patent claims licensable
   * by such Contributor that are necessarily infringed by their
   * Contribution(s) alone or by combination of their Contribution(s)
   * with the Work to which such Contribution(s) was submitted. If You
   * institute patent litigation against any entity (including a
   * cross-claim or counterclaim in a lawsuit) alleging that the Work
   * or a Contribution incorporated within the Work constitutes direct
   * or contributory patent infringement, then any patent licenses
   * granted to You under this License for that Work shall terminate
   * as of the date such litigation is filed.
   *
   * 4. Redistribution. You may reproduce and distribute copies of the
   * Work or Derivative Works thereof in any medium, with or without
   * modifications, and in Source or Object form, provided that You
   * meet the following conditions:
   *
   * (a) You must give any other recipients of the Work or
   * Derivative Works a copy of this License; and
   *
   * (b) You must cause any modified files to carry prominent notices
   * stating that You changed the files; and
   *
   * (c) You must retain, in the Source form of any Derivative Works
   * that You distribute, all copyright, patent, trademark, and
   * attribution notices from the Source form of the Work,
   * excluding those notices that do not pertain to any part of
   * the Derivative Works; and
   *
   * (d) If the Work includes a "NOTICE" text file as part of its
   * distribution, then any Derivative Works that You distribute must
   * include a readable copy of the attribution notices contained
   * within such NOTICE file, excluding those notices that do not
   * pertain to any part of the Derivative Works, in at least one
   * of the following places: within a NOTICE text file distributed
   * as part of the Derivative Works; within the Source form or
   * documentation, if provided along with the Derivative Works; or,
   * within a display generated by the Derivative Works, if and
   * wherever such third-party notices normally appear. The contents
   * of the NOTICE file are for informational purposes only and
   * do not modify the License. You may add Your own attribution
   * notices within Derivative Works that You distribute, alongside
   * or as an addendum to the NOTICE text from the Work, provided
   * that such additional attribution notices cannot be construed
   * as modifying the License.
   *
   * You may add Your own copyright statement to Your modifications and
   * may provide additional or different license terms and conditions
   * for use, reproduction, or distribution of Your modifications, or
   * for any such Derivative Works as a whole, provided Your use,
   * reproduction, and distribution of the Work otherwise complies with
   * the conditions stated in this License.
   *
   * 5. Submission of Contributions. Unless You explicitly state otherwise,
   * any Contribution intentionally submitted for inclusion in the Work
   * by You to the Licensor shall be under the terms and conditions of
   * this License, without any additional terms or conditions.
   * Notwithstanding the above, nothing herein shall supersede or modify
   * the terms of any separate license agreement you may have executed
   * with Licensor regarding such Contributions.
   *
   * 6. Trademarks. This License does not grant permission to use the trade
   * names, trademarks, service marks, or product names of the Licensor,
   * except as required for reasonable and customary use in describing the
   * origin of the Work and reproducing the content of the NOTICE file.
   *
   * 7. Disclaimer of Warranty. Unless required by applicable law or
   * agreed to in writing, Licensor provides the Work (and each
   * Contributor provides its Contributions) on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
   * implied, including, without limitation, any warranties or conditions
   * of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
   * PARTICULAR PURPOSE. You are solely responsible for determining the
   * appropriateness of using or redistributing the Work and assume any
   * risks associated with Your exercise of permissions under this License.
   *
   * 8. Limitation of Liability. In no event and under no legal theory,
   * whether in tort (including negligence), contract, or otherwise,
   * unless required by applicable law (such as deliberate and grossly
   * negligent acts) or agreed to in writing, shall any Contributor be
   * liable to You for damages, including any direct, indirect, special,
   * incidental, or consequential damages of any character arising as a
   * result of this License or out of the use or inability to use the
   * Work (including but not limited to damages for loss of goodwill,
   * work stoppage, computer failure or malfunction, or any and all
   * other commercial damages or losses), even if such Contributor
   * has been advised of the possibility of such damages.
   *
   * 9. Accepting Warranty or Additional Liability. While redistributing
   * the Work or Derivative Works thereof, You may choose to offer,
   * and charge a fee for, acceptance of support, warranty, indemnity,
   * or other liability obligations and/or rights consistent with this
   * License. However, in accepting such obligations, You may act only
   * on Your own behalf and on Your sole responsibility, not on behalf
   * of any other Contributor, and only if You agree to indemnify,
   * defend, and hold each Contributor harmless for any liability
   * incurred by, or claims asserted against, such Contributor by reason
   * of your accepting any such warranty or additional liability.
   *
   * END OF TERMS AND CONDITIONS
   *
   * APPENDIX: How to apply the Apache License to your work.
   *
   * To apply the Apache License to your work, attach the following
   * boilerplate notice, with the fields enclosed by brackets "[]"
   * replaced with your own identifying information. (Don't include
   * the brackets!)  The text should be enclosed in the appropriate
   * comment syntax for the file format. We also recommend that a
   * file or class name and description of purpose be included on the
   * same "printed page" as the copyright notice for easier
   * identification within third-party archives.
   *
   * Copyright 2013 Google Inc. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var DecodeBrotliJson = (function () {
    var self = {};
    (function (module, exports, define, window, global) {
      !function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).DecodeBrotliJson=e()}(function(){return function e(n,t,r){function i(s,f){if(!t[s]){if(!n[s]){var a="function"==typeof require&&require;if(!f&&a)return a(s,!0);if(o)return o(s,!0);var w=new Error("Cannot find module '"+s+"'");throw w.code="MODULE_NOT_FOUND",w}var d=t[s]={exports:{}};n[s][0].call(d.exports,function(e){return i(n[s][1][e]||e)},d,d.exports,e,n,t,r)}return t[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,n,t){var r=e("brotli/decompress"),i=e("base64-js").toByteArray;n.exports=function(e){for(var n=r(i(e)),t=[],o=[],s=0;s<n.length;s+=1)o.push(n[s]),8192===o.length&&(t.push(String.fromCharCode.apply(null,o)),o.length=0);return o.length&&t.push(String.fromCharCode.apply(null,o)),t.join("")}},{"base64-js":2,"brotli/decompress":13}],2:[function(e,n,t){"use strict";t.byteLength=function(e){var n=a(e),t=n[0],r=n[1];return 3*(t+r)/4-r},t.toByteArray=function(e){var n,t,r=a(e),s=r[0],f=r[1],w=new o(function(e,n,t){return 3*(n+t)/4-t}(0,s,f)),d=0,u=f>0?s-4:s;for(t=0;t<u;t+=4)n=i[e.charCodeAt(t)]<<18|i[e.charCodeAt(t+1)]<<12|i[e.charCodeAt(t+2)]<<6|i[e.charCodeAt(t+3)],w[d++]=n>>16&255,w[d++]=n>>8&255,w[d++]=255&n;return 2===f&&(n=i[e.charCodeAt(t)]<<2|i[e.charCodeAt(t+1)]>>4,w[d++]=255&n),1===f&&(n=i[e.charCodeAt(t)]<<10|i[e.charCodeAt(t+1)]<<4|i[e.charCodeAt(t+2)]>>2,w[d++]=n>>8&255,w[d++]=255&n),w},t.fromByteArray=function(e){for(var n,t=e.length,i=t%3,o=[],s=16383,f=0,a=t-i;f<a;f+=s)o.push(d(e,f,f+s>a?a:f+s));return 1===i?(n=e[t-1],o.push(r[n>>2]+r[n<<4&63]+"==")):2===i&&(n=(e[t-2]<<8)+e[t-1],o.push(r[n>>10]+r[n>>4&63]+r[n<<2&63]+"=")),o.join("")};for(var r=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)r[f]=s[f],i[s.charCodeAt(f)]=f;function a(e){var n=e.length;if(n%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var t=e.indexOf("=");return-1===t&&(t=n),[t,t===n?0:4-t%4]}function w(e){return r[e>>18&63]+r[e>>12&63]+r[e>>6&63]+r[63&e]}function d(e,n,t){for(var r,i=[],o=n;o<t;o+=3)r=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),i.push(w(r));return i.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},{}],3:[function(e,n,t){var r=4096,i=new Uint32Array([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215]);function o(e){this.buf_=new Uint8Array(8224),this.input_=e,this.reset()}o.READ_SIZE=r,o.IBUF_MASK=8191,o.prototype.reset=function(){this.buf_ptr_=0,this.val_=0,this.pos_=0,this.bit_pos_=0,this.bit_end_pos_=0,this.eos_=0,this.readMoreInput();for(var e=0;e<4;e++)this.val_|=this.buf_[this.pos_]<<8*e,++this.pos_;return this.bit_end_pos_>0},o.prototype.readMoreInput=function(){if(!(this.bit_end_pos_>256))if(this.eos_){if(this.bit_pos_>this.bit_end_pos_)throw new Error("Unexpected end of input "+this.bit_pos_+" "+this.bit_end_pos_)}else{var e=this.buf_ptr_,n=this.input_.read(this.buf_,e,r);if(n<0)throw new Error("Unexpected end of input");if(n<r){this.eos_=1;for(var t=0;t<32;t++)this.buf_[e+n+t]=0}if(0===e){for(t=0;t<32;t++)this.buf_[8192+t]=this.buf_[t];this.buf_ptr_=r}else this.buf_ptr_=0;this.bit_end_pos_+=n<<3}},o.prototype.fillBitWindow=function(){for(;this.bit_pos_>=8;)this.val_>>>=8,this.val_|=this.buf_[8191&this.pos_]<<24,++this.pos_,this.bit_pos_=this.bit_pos_-8>>>0,this.bit_end_pos_=this.bit_end_pos_-8>>>0},o.prototype.readBits=function(e){32-this.bit_pos_<e&&this.fillBitWindow();var n=this.val_>>>this.bit_pos_&i[e];return this.bit_pos_+=e,n},n.exports=o},{}],4:[function(e,n,t){t.lookup=new Uint8Array([0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),t.lookupOffsets=new Uint16Array([1024,1536,1280,1536,0,256,768,512])},{}],5:[function(e,n,t){var r=e("./streams").BrotliInput,i=e("./streams").BrotliOutput,o=e("./bit_reader"),s=e("./dictionary"),f=e("./huffman").HuffmanCode,a=e("./huffman").BrotliBuildHuffmanTable,w=e("./context"),d=e("./prefix"),u=e("./transform"),p=1080,h=new Uint8Array([1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15]),c=new Uint8Array([3,2,1,0,3,3,3,3,3,3,2,2,2,2,2,2]),b=new Int8Array([0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3]),l=new Uint16Array([256,402,436,468,500,534,566,598,630,662,694,726,758,790,822,854,886,920,952,984,1016,1048,1080]);function v(e){var n;return 0===e.readBits(1)?16:(n=e.readBits(3))>0?17+n:(n=e.readBits(3))>0?8+n:17}function y(e){if(e.readBits(1)){var n=e.readBits(3);return 0===n?1:e.readBits(n)+(1<<n)}return 0}function m(){this.meta_block_length=0,this.input_end=0,this.is_uncompressed=0,this.is_metadata=!1}function W(e){var n,t,r,i=new m;if(i.input_end=e.readBits(1),i.input_end&&e.readBits(1))return i;if(7===(n=e.readBits(2)+4)){if(i.is_metadata=!0,0!==e.readBits(1))throw new Error("Invalid reserved bit");if(0===(t=e.readBits(2)))return i;for(r=0;r<t;r++){var o=e.readBits(8);if(r+1===t&&t>1&&0===o)throw new Error("Invalid size byte");i.meta_block_length|=o<<8*r}}else for(r=0;r<n;++r){var s=e.readBits(4);if(r+1===n&&n>4&&0===s)throw new Error("Invalid size nibble");i.meta_block_length|=s<<4*r}return++i.meta_block_length,i.input_end||i.is_metadata||(i.is_uncompressed=e.readBits(1)),i}function x(e,n,t){var r;return t.fillBitWindow(),(r=e[n+=t.val_>>>t.bit_pos_&255].bits-8)>0&&(t.bit_pos_+=8,n+=e[n].value,n+=t.val_>>>t.bit_pos_&(1<<r)-1),t.bit_pos_+=e[n].bits,e[n].value}function U(e,n,t,r){var i,o,s=new Uint8Array(e);if(r.readMoreInput(),1===(o=r.readBits(2))){for(var w=e-1,d=0,u=new Int32Array(4),p=r.readBits(2)+1;w;)w>>=1,++d;for(c=0;c<p;++c)u[c]=r.readBits(d)%e,s[u[c]]=2;switch(s[u[0]]=1,p){case 1:break;case 3:if(u[0]===u[1]||u[0]===u[2]||u[1]===u[2])throw new Error("[ReadHuffmanCode] invalid symbols");break;case 2:if(u[0]===u[1])throw new Error("[ReadHuffmanCode] invalid symbols");s[u[1]]=1;break;case 4:if(u[0]===u[1]||u[0]===u[2]||u[0]===u[3]||u[1]===u[2]||u[1]===u[3]||u[2]===u[3])throw new Error("[ReadHuffmanCode] invalid symbols");r.readBits(1)?(s[u[2]]=3,s[u[3]]=3):s[u[0]]=2}}else{var c,b=new Uint8Array(18),l=32,v=0,y=[new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,1),new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,5)];for(c=o;c<18&&l>0;++c){var m,W=h[c],x=0;r.fillBitWindow(),x+=r.val_>>>r.bit_pos_&15,r.bit_pos_+=y[x].bits,m=y[x].value,b[W]=m,0!==m&&(l-=32>>m,++v)}if(1!==v&&0!==l)throw new Error("[ReadHuffmanCode] invalid num_codes or space");!function(e,n,t,r){for(var i=0,o=8,s=0,w=0,d=32768,u=[],p=0;p<32;p++)u.push(new f(0,0));for(a(u,0,5,e,18);i<n&&d>0;){var h,c=0;if(r.readMoreInput(),r.fillBitWindow(),c+=r.val_>>>r.bit_pos_&31,r.bit_pos_+=u[c].bits,(h=255&u[c].value)<16)s=0,t[i++]=h,0!==h&&(o=h,d-=32768>>h);else{var b,l,v=h-14,y=0;if(16===h&&(y=o),w!==y&&(s=0,w=y),b=s,s>0&&(s-=2,s<<=v),i+(l=(s+=r.readBits(v)+3)-b)>n)throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");for(var m=0;m<l;m++)t[i+m]=w;i+=l,0!==w&&(d-=l<<15-w)}}if(0!==d)throw new Error("[ReadHuffmanCodeLengths] space = "+d);for(;i<n;i++)t[i]=0}(b,e,s,r)}if(0===(i=a(n,t,8,s,e)))throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");return i}function E(e,n,t){var r,i;return r=x(e,n,t),i=d.kBlockLengthPrefixCode[r].nbits,d.kBlockLengthPrefixCode[r].offset+t.readBits(i)}function V(e,n,t){var r;return e<16?(t+=c[e],r=n[t&=3]+b[e]):r=e-16+1,r}function O(e,n){for(var t=e[n],r=n;r;--r)e[r]=e[r-1];e[0]=t}function N(e,n){this.alphabet_size=e,this.num_htrees=n,this.codes=new Array(n+n*l[e+31>>>5]),this.htrees=new Uint32Array(n)}function q(e,n){var t,r,i={num_htrees:null,context_map:null},o=0;n.readMoreInput();var s=i.num_htrees=y(n)+1,a=i.context_map=new Uint8Array(e);if(s<=1)return i;for(n.readBits(1)&&(o=n.readBits(4)+1),t=[],r=0;r<p;r++)t[r]=new f(0,0);for(U(s+o,t,0,n),r=0;r<e;){var w;if(n.readMoreInput(),0===(w=x(t,0,n)))a[r]=0,++r;else if(w<=o)for(var d=1+(1<<w)+n.readBits(w);--d;){if(r>=e)throw new Error("[DecodeContextMap] i >= context_map_size");a[r]=0,++r}else a[r]=w-o,++r}return n.readBits(1)&&function(e,n){var t,r=new Uint8Array(256);for(t=0;t<256;++t)r[t]=t;for(t=0;t<n;++t){var i=e[t];e[t]=r[i],i&&O(r,i)}}(a,e),i}function B(e,n,t,r,i,o,s){var f,a=2*t,w=t,d=x(n,t*p,s);(f=0===d?i[a+(1&o[w])]:1===d?i[a+(o[w]-1&1)]+1:d-2)>=e&&(f-=e),r[t]=f,i[a+(1&o[w])]=f,++o[w]}function Y(e,n,t,r,i,s){var f,a=i+1,w=t&i,d=s.pos_&o.IBUF_MASK;if(n<8||s.bit_pos_+(n<<3)<s.bit_end_pos_)for(;n-- >0;)s.readMoreInput(),r[w++]=s.readBits(8),w===a&&(e.write(r,a),w=0);else{if(s.bit_end_pos_<32)throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");for(;s.bit_pos_<32;)r[w]=s.val_>>>s.bit_pos_,s.bit_pos_+=8,++w,--n;if(d+(f=s.bit_end_pos_-s.bit_pos_>>3)>o.IBUF_MASK){for(var u=o.IBUF_MASK+1-d,p=0;p<u;p++)r[w+p]=s.buf_[d+p];f-=u,w+=u,n-=u,d=0}for(p=0;p<f;p++)r[w+p]=s.buf_[d+p];if(n-=f,(w+=f)>=a)for(e.write(r,a),w-=a,p=0;p<w;p++)r[p]=r[a+p];for(;w+n>=a;){if(f=a-w,s.input_.read(r,w,f)<f)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");e.write(r,a),n-=f,w=0}if(s.input_.read(r,w,n)<n)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");s.reset()}}function R(e){var n=e.bit_pos_+7&-8;return 0==e.readBits(n-e.bit_pos_)}function H(e){var n=new r(e),t=new o(n);return v(t),W(t).meta_block_length}function M(e,n){var t,r,i,a,h,c,b,l,m,O,H=0,M=0,g=0,A=[16,15,11,4],F=0,Z=0,P=0,k=[new N(0,0),new N(0,0),new N(0,0)],K=128+o.READ_SIZE;i=(1<<(r=v(O=new o(e))))-16,h=(a=1<<r)-1,c=new Uint8Array(a+K+s.maxDictionaryWordLength),b=a,l=[],m=[];for(var X=0;X<3240;X++)l[X]=new f(0,0),m[X]=new f(0,0);for(;!M;){var G,L,J,T,z,D,I,j,C,Q,S,_=0,$=[1<<28,1<<28,1<<28],ee=[0],ne=[1,1,1],te=[0,1,0,1,0,1],re=[0],ie=null,oe=null,se=0,fe=null,ae=0,we=0,de=0;for(t=0;t<3;++t)k[t].codes=null,k[t].htrees=null;O.readMoreInput();var ue=W(O);if(H+(_=ue.meta_block_length)>n.buffer.length){var pe=new Uint8Array(H+_);pe.set(n.buffer),n.buffer=pe}if(M=ue.input_end,G=ue.is_uncompressed,ue.is_metadata)for(R(O);_>0;--_)O.readMoreInput(),O.readBits(8);else if(0!==_)if(G)O.bit_pos_=O.bit_pos_+7&-8,Y(n,_,H,c,h,O),H+=_;else{for(t=0;t<3;++t)ne[t]=y(O)+1,ne[t]>=2&&(U(ne[t]+2,l,t*p,O),U(26,m,t*p,O),$[t]=E(m,t*p,O),re[t]=1);for(O.readMoreInput(),T=(1<<(L=O.readBits(2)))-1,z=(J=16+(O.readBits(4)<<L))+(48<<L),ie=new Uint8Array(ne[0]),t=0;t<ne[0];++t)O.readMoreInput(),ie[t]=O.readBits(2)<<1;var he=q(ne[0]<<6,O);I=he.num_htrees,D=he.context_map;var ce=q(ne[2]<<2,O);for(C=ce.num_htrees,j=ce.context_map,k[0]=new N(256,I),k[1]=new N(704,ne[1]),k[2]=new N(z,C),t=0;t<3;++t)k[t].decode(O);for(oe=0,fe=0,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1],S=k[1].htrees[0];_>0;){var be,le,ve,ye,me,We,xe,Ue,Ee,Ve,Oe,Ne;for(O.readMoreInput(),0===$[1]&&(B(ne[1],l,1,ee,te,re,O),$[1]=E(m,p,O),S=k[1].htrees[ee[1]]),--$[1],(le=(be=x(k[1].codes,S,O))>>6)>=2?(le-=2,xe=-1):xe=0,ve=d.kInsertRangeLut[le]+(be>>3&7),ye=d.kCopyRangeLut[le]+(7&be),me=d.kInsertLengthPrefixCode[ve].offset+O.readBits(d.kInsertLengthPrefixCode[ve].nbits),We=d.kCopyLengthPrefixCode[ye].offset+O.readBits(d.kCopyLengthPrefixCode[ye].nbits),Z=c[H-1&h],P=c[H-2&h],Ee=0;Ee<me;++Ee)O.readMoreInput(),0===$[0]&&(B(ne[0],l,0,ee,te,re,O),$[0]=E(m,0,O),oe=ee[0]<<6,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1]),se=D[oe+(w.lookup[we+Z]|w.lookup[de+P])],--$[0],P=Z,Z=x(k[0].codes,k[0].htrees[se],O),c[H&h]=Z,(H&h)===h&&n.write(c,a),++H;if((_-=me)<=0)break;if(xe<0&&(O.readMoreInput(),0===$[2]&&(B(ne[2],l,2,ee,te,re,O),$[2]=E(m,2160,O),fe=ee[2]<<2),--$[2],ae=j[fe+(255&(We>4?3:We-2))],(xe=x(k[2].codes,k[2].htrees[ae],O))>=J&&(Ne=(xe-=J)&T,xe=J+((qe=(2+(1&(xe>>=L))<<(Oe=1+(xe>>1)))-4)+O.readBits(Oe)<<L)+Ne)),(Ue=V(xe,A,F))<0)throw new Error("[BrotliDecompress] invalid distance");if(Ve=H&h,Ue>(g=H<i&&g!==i?H:i)){if(!(We>=s.minDictionaryWordLength&&We<=s.maxDictionaryWordLength))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var qe=s.offsetsByLength[We],Be=Ue-g-1,Ye=s.sizeBitsByLength[We],Re=Be>>Ye;if(qe+=(Be&(1<<Ye)-1)*We,!(Re<u.kNumTransforms))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var He=u.transformDictionaryWord(c,Ve,qe,We,Re);if(H+=He,_-=He,(Ve+=He)>=b){n.write(c,a);for(var Me=0;Me<Ve-b;Me++)c[Me]=c[b+Me]}}else{if(xe>0&&(A[3&F]=Ue,++F),We>_)throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);for(Ee=0;Ee<We;++Ee)c[H&h]=c[H-Ue&h],(H&h)===h&&n.write(c,a),++H,--_}Z=c[H-1&h],P=c[H-2&h]}H&=1073741823}}n.write(c,H&h)}N.prototype.decode=function(e){var n,t=0;for(n=0;n<this.num_htrees;++n)this.htrees[n]=t,t+=U(this.alphabet_size,this.codes,t,e)},t.BrotliDecompressedSize=H,t.BrotliDecompressBuffer=function(e,n){var t=new r(e);null==n&&(n=H(e));var o=new Uint8Array(n),s=new i(o);return M(t,s),s.pos<s.buffer.length&&(s.buffer=s.buffer.subarray(0,s.pos)),s.buffer},t.BrotliDecompress=M,s.init()},{"./bit_reader":3,"./context":4,"./dictionary":8,"./huffman":9,"./prefix":10,"./streams":11,"./transform":12}],6:[function(e,n,t){var r=e("base64-js");t.init=function(){return(0,e("./decode").BrotliDecompressBuffer)(r.toByteArray(e("./dictionary.bin.js")))}},{"./decode":5,"./dictionary.bin.js":7,"base64-js":2}],7:[function(e,n,t){n.exports="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"},{}],8:[function(e,n,t){var r=e("./dictionary-data");t.init=function(){t.dictionary=r.init()},t.offsetsByLength=new Uint32Array([0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016]),t.sizeBitsByLength=new Uint8Array([0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5]),t.minDictionaryWordLength=4,t.maxDictionaryWordLength=24},{"./dictionary-data":6}],9:[function(e,n,t){function r(e,n){this.bits=e,this.value=n}t.HuffmanCode=r;function i(e,n){for(var t=1<<n-1;e&t;)t>>=1;return(e&t-1)+t}function o(e,n,t,i,o){do{e[n+(i-=t)]=new r(o.bits,o.value)}while(i>0)}function s(e,n,t){for(var r=1<<n-t;n<15&&!((r-=e[n])<=0);)++n,r<<=1;return n-t}t.BrotliBuildHuffmanTable=function(e,n,t,f,a){var w,d,u,p,h,c,b,l,v,y,m=n,W=new Int32Array(16),x=new Int32Array(16);for(y=new Int32Array(a),d=0;d<a;d++)W[f[d]]++;for(x[1]=0,w=1;w<15;w++)x[w+1]=x[w]+W[w];for(d=0;d<a;d++)0!==f[d]&&(y[x[f[d]]++]=d);if(v=l=1<<(b=t),1===x[15]){for(u=0;u<v;++u)e[n+u]=new r(0,65535&y[0]);return v}for(u=0,d=0,w=1,p=2;w<=t;++w,p<<=1)for(;W[w]>0;--W[w])o(e,n+u,p,l,new r(255&w,65535&y[d++])),u=i(u,w);for(c=v-1,h=-1,w=t+1,p=2;w<=15;++w,p<<=1)for(;W[w]>0;--W[w])(u&c)!==h&&(n+=l,v+=l=1<<(b=s(W,w,t)),e[m+(h=u&c)]=new r(b+t&255,n-m-h&65535)),o(e,n+(u>>t),p,l,new r(w-t&255,65535&y[d++])),u=i(u,w);return v}},{}],10:[function(e,n,t){function r(e,n){this.offset=e,this.nbits=n}t.kBlockLengthPrefixCode=[new r(1,2),new r(5,2),new r(9,2),new r(13,2),new r(17,3),new r(25,3),new r(33,3),new r(41,3),new r(49,4),new r(65,4),new r(81,4),new r(97,4),new r(113,5),new r(145,5),new r(177,5),new r(209,5),new r(241,6),new r(305,6),new r(369,7),new r(497,8),new r(753,9),new r(1265,10),new r(2289,11),new r(4337,12),new r(8433,13),new r(16625,24)],t.kInsertLengthPrefixCode=[new r(0,0),new r(1,0),new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,1),new r(8,1),new r(10,2),new r(14,2),new r(18,3),new r(26,3),new r(34,4),new r(50,4),new r(66,5),new r(98,5),new r(130,6),new r(194,7),new r(322,8),new r(578,9),new r(1090,10),new r(2114,12),new r(6210,14),new r(22594,24)],t.kCopyLengthPrefixCode=[new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,0),new r(7,0),new r(8,0),new r(9,0),new r(10,1),new r(12,1),new r(14,2),new r(18,2),new r(22,3),new r(30,3),new r(38,4),new r(54,4),new r(70,5),new r(102,5),new r(134,6),new r(198,7),new r(326,8),new r(582,9),new r(1094,10),new r(2118,24)],t.kInsertRangeLut=[0,0,8,8,0,16,8,16,16],t.kCopyRangeLut=[0,8,0,8,16,0,16,8,16]},{}],11:[function(e,n,t){function r(e){this.buffer=e,this.pos=0}function i(e){this.buffer=e,this.pos=0}r.prototype.read=function(e,n,t){this.pos+t>this.buffer.length&&(t=this.buffer.length-this.pos);for(var r=0;r<t;r++)e[n+r]=this.buffer[this.pos+r];return this.pos+=t,t},t.BrotliInput=r,i.prototype.write=function(e,n){if(this.pos+n>this.buffer.length)throw new Error("Output buffer is not large enough");return this.buffer.set(e.subarray(0,n),this.pos),this.pos+=n,n},t.BrotliOutput=i},{}],12:[function(e,n,t){var r=e("./dictionary"),i=10,o=11;function s(e,n,t){this.prefix=new Uint8Array(e.length),this.transform=n,this.suffix=new Uint8Array(t.length);for(var r=0;r<e.length;r++)this.prefix[r]=e.charCodeAt(r);for(r=0;r<t.length;r++)this.suffix[r]=t.charCodeAt(r)}var f=[new s("",0,""),new s("",0," "),new s(" ",0," "),new s("",12,""),new s("",i," "),new s("",0," the "),new s(" ",0,""),new s("s ",0," "),new s("",0," of "),new s("",i,""),new s("",0," and "),new s("",13,""),new s("",1,""),new s(", ",0," "),new s("",0,", "),new s(" ",i," "),new s("",0," in "),new s("",0," to "),new s("e ",0," "),new s("",0,'"'),new s("",0,"."),new s("",0,'">'),new s("",0,"\n"),new s("",3,""),new s("",0,"]"),new s("",0," for "),new s("",14,""),new s("",2,""),new s("",0," a "),new s("",0," that "),new s(" ",i,""),new s("",0,". "),new s(".",0,""),new s(" ",0,", "),new s("",15,""),new s("",0," with "),new s("",0,"'"),new s("",0," from "),new s("",0," by "),new s("",16,""),new s("",17,""),new s(" the ",0,""),new s("",4,""),new s("",0,". The "),new s("",o,""),new s("",0," on "),new s("",0," as "),new s("",0," is "),new s("",7,""),new s("",1,"ing "),new s("",0,"\n\t"),new s("",0,":"),new s(" ",0,". "),new s("",0,"ed "),new s("",20,""),new s("",18,""),new s("",6,""),new s("",0,"("),new s("",i,", "),new s("",8,""),new s("",0," at "),new s("",0,"ly "),new s(" the ",0," of "),new s("",5,""),new s("",9,""),new s(" ",i,", "),new s("",i,'"'),new s(".",0,"("),new s("",o," "),new s("",i,'">'),new s("",0,'="'),new s(" ",0,"."),new s(".com/",0,""),new s(" the ",0," of the "),new s("",i,"'"),new s("",0,". This "),new s("",0,","),new s(".",0," "),new s("",i,"("),new s("",i,"."),new s("",0," not "),new s(" ",0,'="'),new s("",0,"er "),new s(" ",o," "),new s("",0,"al "),new s(" ",o,""),new s("",0,"='"),new s("",o,'"'),new s("",i,". "),new s(" ",0,"("),new s("",0,"ful "),new s(" ",i,". "),new s("",0,"ive "),new s("",0,"less "),new s("",o,"'"),new s("",0,"est "),new s(" ",i,"."),new s("",o,'">'),new s(" ",0,"='"),new s("",i,","),new s("",0,"ize "),new s("",o,"."),new s("Â ",0,""),new s(" ",0,","),new s("",i,'="'),new s("",o,'="'),new s("",0,"ous "),new s("",o,", "),new s("",i,"='"),new s(" ",i,","),new s(" ",o,'="'),new s(" ",o,", "),new s("",o,","),new s("",o,"("),new s("",o,". "),new s(" ",o,"."),new s("",o,"='"),new s(" ",o,". "),new s(" ",i,'="'),new s(" ",o,"='"),new s(" ",i,"='")];function a(e,n){return e[n]<192?(e[n]>=97&&e[n]<=122&&(e[n]^=32),1):e[n]<224?(e[n+1]^=32,2):(e[n+2]^=5,3)}t.kTransforms=f,t.kNumTransforms=f.length,t.transformDictionaryWord=function(e,n,t,s,w){var d,u=f[w].prefix,p=f[w].suffix,h=f[w].transform,c=h<12?0:h-11,b=0,l=n;c>s&&(c=s);for(var v=0;v<u.length;)e[n++]=u[v++];for(t+=c,s-=c,h<=9&&(s-=h),b=0;b<s;b++)e[n++]=r.dictionary[t+b];if(d=n-s,h===i)a(e,d);else if(h===o)for(;s>0;){var y=a(e,d);d+=y,s-=y}for(var m=0;m<p.length;)e[n++]=p[m++];return n-l}},{"./dictionary":8}],13:[function(e,n,t){n.exports=e("./dec/decode").BrotliDecompressBuffer},{"./dec/decode":5}]},{},[1])(1)});
    }(void 0, void 0, void 0, void 0, void 0));
    return self.DecodeBrotliJson;
  }());
  var compressed = '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';
  if (compressed.length !== 300924 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4758276) throw new Error('Invalid embedded sheet data length.');
  var bundle = JSON.parse(decoded);
  var strings = bundle.d || [];
  function expand(value) {
    if (typeof value === 'string' && value.charAt(0) === '')
      return strings[parseInt(value.substring(1), 36)];
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { value[index] = expand(item); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { value[key] = expand(value[key]); });
    }
    return value;
  }
  var packed = expand(bundle.p || bundle);
  var embedded = packed.s || [];
  var sharedModeSets = packed.m || [];
  var serializedModes = sharedModeSets.map(JSON.stringify);
  var serializedRollVisibility = (packed.r || []).map(JSON.stringify);
  var serializedFieldVisibility = (packed.v || []).map(JSON.stringify);
  var serializedFieldAliases = (packed.a || []).map(JSON.stringify);
  embedded.forEach(function (sheet) {
    var modeSets = (sheet.M || []).map(function (index) { return serializedModes[index]; });
    var rollVisibilitySets = (sheet.R || []).map(function (index) { return JSON.parse(serializedRollVisibility[index]); });
    sheet.rolls = (sheet.rolls || []).map(function (roll) {
      var restored = { key: roll[0], name: roll[1] || null, label: roll[2] || '', aliases: roll[3] || [],
        raw: roll[4] || '', template: roll[5] || null, repeating: roll[7] || null,
        staticLabels: roll[8] || [], labelRefs: roll[9] || [], expressionRefs: roll[10] || [],
        modes: roll[13] ? JSON.parse(modeSets[roll[13] - 1]) : [] };
      if (roll[6]) restored.refs = roll[6];
      if (roll[11]) restored.controls = roll[11];
      if (roll[12]) restored.modesIncomplete = true;
      if (roll[14]) restored.visibility = rollVisibilitySets[roll[14] - 1];
      return restored;
    });
    delete sheet.M;
    delete sheet.R;
    var fieldVisibilitySets = (sheet.V || []).map(function (index) { return JSON.parse(serializedFieldVisibility[index]); });
    var fieldAliasSets = (sheet.A || []).map(function (index) { return JSON.parse(serializedFieldAliases[index]); });
    delete sheet.V;
    delete sheet.A;
    var fieldTypes = ['text','number','range','checkbox','radio','hidden','textarea','select'];
    var sections = Object.keys(sheet.sections || {}).sort();
    var repeatingFields = Object.create(null);
    sections.forEach(function (section) {
      (sheet.sections[section] || []).forEach(function (name) { repeatingFields[name] = true; });
    });
    var globalRepeating = sheet.g || [];
    sheet.globalAttributes = (sheet.attributes || []).filter(function (name) {
      return !repeatingFields[name] || globalRepeating.indexOf(name) >= 0;
    });
    delete sheet.g;
    sheet.fields = (sheet.f || []).map(function (field) {
      var flags = Number(field[3]) || 0;
      var restored = { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
      if (field[11]) restored.defaultVariants = [restored.default].concat(field[11]);
      return restored;
    });
    delete sheet.f;
    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))
      KIBSheetContracts.push(sheet);
  });
}());
/* SCENE_SUITE_SHEET_RECOGNITION_END */

// ===== 사용자 설정 =====
var sheet_helper_setting = {
  enabled: true,
  legacy_commands: true,
  manager_name: '[GM] 시트 헬퍼 관리',
  player_help_name: '[PL] 시트 헬퍼 사용법',
  refresh_delay: 700,
};

(function (api) {
  'use strict';

  var SHEET_NOT_RECOGNIZED = '현재 인식된 시트가 없습니다.';

  var VERSION = '0.6.33';
  var cache = {};
  var attributeObjectCache = {};
  var refreshTimer = null;
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var suppressedAttributeChanges = {};
  var pendingAttributeChanges = {};
  var pendingAttributeOrder = [];
  var attributeChangeTimer = null;

  function own(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function dictionary(source) {
    var result = Object.create(null);
    Object.keys(source || {}).forEach(function (key) { result[key] = source[key]; });
    return result;
  }

  function trim(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

 function normalize(value) {
    return trim(value)
      .toLowerCase()
      .replace(/[\s_()（）\[\]{}\/\\.\u00b7,:：-]+/g, '');
  }

  function arithmeticValue(expression) {
    var source = trim(expression).replace(/\s+/g, '');
    var tokens = source.match(/floor|ceil|round|min|max|abs|\d+(?:\.\d+)?|[()+\-*/,]/gi) || [];
    if (!source || tokens.join('') !== source || tokens.length > 200) return null;
    var at = 0;
    function primary() {
      var token = tokens[at++];
      if (token === '+' || token === '-') {
        var unary = primary();
        return unary === null ? null : token === '-' ? -unary : unary;
      }
      if (token === '(') {
        var nested = expressionValue();
        if (tokens[at++] !== ')') return null;
        return nested;
      }
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token || '')) {
        var name = token.toLowerCase();
        if (tokens[at++] !== '(') return null;
        var args = [expressionValue()];
        while (tokens[at] === ',') { at += 1; args.push(expressionValue()); }
        if (tokens[at++] !== ')' || args.some(function (value) { return value === null; })) return null;
        if ((name === 'min' || name === 'max') && args.length)
          return Math[name].apply(Math, args);
        if (args.length !== 1) return null;
        return Math[name](args[0]);
      }
      return /^\d+(?:\.\d+)?$/.test(token || '') ? Number(token) : null;
    }
    function term() {
      var value = primary();
      while (value !== null && (tokens[at] === '*' || tokens[at] === '/')) {
        var op = tokens[at++];
        var right = primary();
        if (right === null || (op === '/' && right === 0)) return null;
        value = op === '*' ? value * right : value / right;
      }
      return value;
    }
    function expressionValue() {
      var value = term();
      while (value !== null && (tokens[at] === '+' || tokens[at] === '-')) {
        var op = tokens[at++];
        var right = term();
        if (right === null) return null;
        value = op === '+' ? value + right : value - right;
      }
      return value;
    }
    var result = expressionValue();
    return at === tokens.length && result !== null && isFinite(result) ? result : null;
  }

  function resolvedResourceValue(characterId, raw, defaults, rowContext) {
    var source = trim(raw);
    if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(source)) {
      var direct = Number(source);
      return { number: direct, text: String(direct) };
    }
    var resolved = resolvedRollExpression(characterId, source,
      rowContext && rowContext.scopes || [], 0, {}, defaults, rowContext);
    if (!resolved)
      return { number: null, text: source.indexOf('@{') > -1 ? '확인 필요' : source };
    if (!/(?:^|[^A-Za-z0-9_])(?:\d*)d\d+(?:[^A-Za-z0-9_]|$)/i.test(resolved)) {
      if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(resolved)) {
        var numeric = Number(resolved);
        return { number: numeric, text: String(numeric) };
      }
      var calculated = arithmeticValue(resolved);
      if (calculated !== null) {
        calculated = Math.round(calculated * 100) / 100;
        return { number: calculated, text: String(calculated) };
      }
    }
    return { number: null, text: resolved.indexOf('@{') > -1 ? '확인 필요' : resolved };
  }

  function getAttr(characterId, name, valueType) {
    if (!characterId || !name) return undefined;
    try {
      return getAttrByName(characterId, name, valueType || 'current');
    } catch (err) {
      return undefined;
    }
  }

  function cachedAttrReader(characterId) {
    var values = dictionary();
    return function (name, type) {
      var key = trim(name) + '|' + (type || 'current');
      if (!own(values, key)) values[key] = getAttr(characterId, name, type);
      return values[key];
    };
  }

  function attrObjects(characterId) {
    return (
      findObjs({ _type: 'attribute', _characterid: characterId }) ||
      findObjs({ type: 'attribute', characterid: characterId }) ||
      []
    );
  }

  function characterObjects() {
    return (findObjs({ _type: 'character' }) || findObjs({ type: 'character' }) || [])
      .slice()
      .sort(function (a, b) {
        return trim(a.get('name')).localeCompare(trim(b.get('name')));
      });
  }

  function initState() {
    state.KIBSheetHelper = state.KIBSheetHelper || {};
    var data = state.KIBSheetHelper;
    if (typeof data.managerId !== 'string') data.managerId = '';
    if (typeof data.managerCharacterId !== 'string') data.managerCharacterId = '';
    if (typeof data.managerHash !== 'string') data.managerHash = '';
    if (typeof data.playerHelpId !== 'string') data.playerHelpId = '';
    if (typeof data.playerHelpHash !== 'string') data.playerHelpHash = '';
    if (!/^(?:public|gm|off)$/.test(data.trackingMode || ''))
      data.trackingMode = own(state, 'hide_tracking') && typeof state.hide_tracking === 'boolean'
        ? state.hide_tracking ? 'gm' : 'public'
        : 'gm';
    if (typeof data.trackGmOnly !== 'boolean') data.trackGmOnly = false;
    data.version = VERSION;
    return data;
  }

  function collectRows(characterId, section, fields, objects, knownPrefixes) {
    var prefix = 'repeating_' + section + '_';
    var attributes = objects || attrObjects(characterId);
    var prefixes = Array.isArray(knownPrefixes) ? knownPrefixes.slice().sort(function (left, right) {
      return right.length - left.length;
    }) : null;
    var sortedFields = fields.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var rows = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name.indexOf(prefix) !== 0) return;
      if (prefixes) {
        var matchedPrefix = '';
        for (var p = 0; p < prefixes.length; p++) {
          if (name.indexOf(prefixes[p]) === 0) { matchedPrefix = prefixes[p]; break; }
        }
        if (matchedPrefix && matchedPrefix !== prefix) return;
      }
      for (var i = 0; i < sortedFields.length; i++) {
        var field = sortedFields[i];
        var suffix = '_' + field;
        if (name.length <= prefix.length + suffix.length) continue;
        if (name.substring(name.length - suffix.length) !== suffix) continue;
        var rowId = name.substring(prefix.length, name.length - suffix.length);
        if (!rows[rowId]) {
          rows[rowId] = { id: rowId, values: dictionary(), names: dictionary(), refs: dictionary() };
        }
        rows[rowId].values[field] = attribute.get('current');
        rows[rowId].names[field] = name;
        rows[rowId].refs[field] = name;
        break;
      }
    });
    var orderName = '_reporder_repeating_' + section;
    var orderAttribute = attributes.filter(function (attribute) {
      return trim(attribute.get('name')) === orderName;
    })[0];
    var ordered = trim(orderAttribute && orderAttribute.get('current'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    var orderedRows = dictionary();
    ordered.forEach(function (rowId) { orderedRows[rowId] = true; });
    Object.keys(rows).sort().forEach(function (rowId) {
      if (!orderedRows[rowId]) {
        ordered.push(rowId);
        orderedRows[rowId] = true;
      }
    });
    ordered = ordered.filter(function (rowId) {
      return !!rows[rowId];
    });
    ordered.forEach(function (rowId, index) {
      fields.forEach(function (field) {
        var row = rows[rowId];
        var exactName = prefix + rowId + '_' + field;
        if (!row.names[field]) row.names[field] = exactName;
        if (own(row.values, field)) return;
        var orderedName = prefix + '$' + index + '_' + field;
        var value = getAttr(characterId, orderedName);
        if (value === undefined) return;
        row.values[field] = value;
        row.refs[field] = orderedName;
      });
    });
    return ordered.map(function (rowId) {
      return rows[rowId];
    });
  }

  function sheetContracts() {
    var found = dictionary();
    var result = [];
    if (!Array.isArray(KIBSheetContracts)) return result;
    for (var i = KIBSheetContracts.length - 1; i >= 0; i--) {
      var contract = KIBSheetContracts[i];
      if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) || found[contract.id]) continue;
      found[contract.id] = true;
      result.unshift(contract);
    }
    return result;
  }

  function registerContract(contract) {
    if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) ||
      (!contractSignature(contract).entries.length && !(Array.isArray(contract.attributes) && contract.attributes.length)))
      throw new Error('시트 인식 정보 형식이 올바르지 않습니다.');
    var replaced = false;
    KIBSheetContracts = KIBSheetContracts.map(function (current) {
      if (current && current.id === contract.id) {
        replaced = true;
        return contract;
      }
      return current;
    });
    if (!replaced) KIBSheetContracts.push(contract);
    contractCatalogCache = null;
    invalidate();
    return contract;
  }

  function contractSignature(contract) {
    var source = contract && contract.signature;
    var entries = [];
    var minimum = 0;
    var requiredNames = [];
    if (Array.isArray(source)) {
      entries = source;
    } else if (source && typeof source === 'object') {
      var attrs = source.attrs || source.attributes || source.required;
      if (Array.isArray(source.required)) requiredNames = source.required.map(trim);
      if (Array.isArray(attrs)) entries = attrs;
      else {
        Object.keys(source).forEach(function (name) {
          if (/^(?:min|minimum|threshold|attrs|attributes|required)$/i.test(name)) return;
          entries.push({ name: name, weight: source[name] });
        });
      }
      minimum = Number(source.minimum || source.min || source.threshold);
    }
    entries = entries.map(function (entry) {
      if (typeof entry === 'string') return { name: trim(entry), weight: 1, required: requiredNames.indexOf(trim(entry)) > -1 };
      return {
        name: trim(entry && (entry.name || entry.attr || entry.key)),
        weight: Math.max(1, Number(entry && entry.weight) || 1),
        required: !!(entry && entry.required) || requiredNames.indexOf(trim(entry && (entry.name || entry.attr || entry.key))) > -1,
      };
    }).filter(function (entry) { return !!entry.name; });
    var total = entries.reduce(function (sum, entry) { return sum + entry.weight; }, 0);
    if (!(minimum > 0)) minimum = Math.min(total, Math.max(3, Math.ceil(total * 0.6)));
    return { entries: entries, minimum: minimum, total: total };
  }

  function contractDefaultMap(contract) {
    var result = dictionary();
    (contract && contract.fields || []).forEach(function (field) {
      var name = trim(field && field.name);
      if (!name || field.section || !own(field, 'default')) return;
      result[name] = String(field.default == null ? '' : field.default);
    });
    return result;
  }

  function normalizedDefault(value) {
    return trim(value).toLowerCase().replace(/\s+/g, '');
  }

  function sourceDefaultEvidence(characterId, records, savedNames) {
    var scores = records.map(function () { return 0; });
    var blankContradictions = records.map(function () { return 0; });
    var missingContradictions = records.map(function () { return 0; });
    var sourceContradictions = records.map(function () { return 0; });
    var active = records.slice();
    var used = dictionary(),probes = [];
    var reads = typeof getSheetDefaultValue == 'function'?getSheetDefaultValue:cachedAttrReader(characterId);
    var savedUnique = records.map(function () { return 0; });
    Object.keys(savedNames || {}).forEach(function (name) {
      var owners = records.filter(function (record) { return !!record.globalSet[name]; });
      if (owners.length === 1) savedUnique[owners[0].ordinal] += 1;
    });
    function expectedDefault(record, name) {
      return own(record.defaults, name)
        ? 'value:' + normalizedDefault(record.defaults[name])
        : 'missing';
    }
    var available = dictionary();
    records.forEach(function (record) {
      Object.keys(record.defaults || {}).forEach(function (name) { available[name] = true; });
    });
    var defaultNames = Object.keys(available).sort();
    var defaultValues = dictionary();
    var separatingDefaultNames = [];
    defaultNames.forEach(function (name) {
      var firstExpected = '';
      var different = false;
      var hasNonEmpty = false;
      var values = records.map(function (record, index) {
        var expected = expectedDefault(record, name);
        if (!index) firstExpected = expected;
        else if (expected !== firstExpected) different = true;
        if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        return expected;
      });
      defaultValues[name] = values;
      if ((!savedNames || !savedNames[name]) && hasNonEmpty && different)
        separatingDefaultNames.push(name);
    });
    function nextField() {
      if (!active.length) return '';
      if (active.length === 1) {
        for (var only = 0; only < defaultNames.length; only += 1) {
          var confirmation = defaultNames[only];
          if (!used[confirmation] && !(savedNames && savedNames[confirmation]) &&
              own(active[0].defaults || {}, confirmation) &&
              normalizedDefault((active[0].defaults || {})[confirmation])) return confirmation;
        }
        return '';
      }
      var selected = '';
      var selectedSeparation = -1;
      for (var fieldAt = 0; fieldAt < separatingDefaultNames.length; fieldAt += 1) {
        var name = separatingDefaultNames[fieldAt];
        if (used[name]) continue;
        var counts = dictionary();
        var hasNonEmpty = false;
        for (var activeAt = 0; activeAt < active.length; activeAt += 1) {
          var expected = defaultValues[name][active[activeAt].ordinal];
          counts[expected] = (counts[expected] || 0) + 1;
          if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        }
        var groups = Object.keys(counts);
        if (!hasNonEmpty || groups.length < 2) continue;
        var separation = active.length * active.length;
        groups.forEach(function (value) {
          separation -= counts[value] * counts[value];
        });
        if (separation > selectedSeparation) {
          selected = name;
          selectedSeparation = separation;
        }
      }
      return selected;
    }
    for (var attempt = 0; attempt < 48; attempt += 1) {
      var name = nextField();
      if (!name) break;
      used[name] = true;
      var rawActual = reads(name);
      var actual = normalizedDefault(rawActual);
      if (rawActual === undefined || rawActual === null) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) missingContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: '', matches: [] });
      } else if (!actual) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) blankContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: [] });
      } else {
        var actualDefault = 'value:' + actual;
        // 현재 원본에 있는 필드를 선언하지 않은 후보는 공통 기본값이 같아도 제외합니다.
        // getAttrByName 대체 경로에는 이전 시트의 저장값이 섞일 수 있습니다.
        if (typeof getSheetDefaultValue === 'function') records.forEach(function (record) {
          if (!record.globalSet[name]) sourceContradictions[record.ordinal] += 1;
          else if (own(record.defaults, name) && normalizedDefault(record.defaults[name]) !== actual &&
              /[&?]\{|\{\{/.test(record.defaults[name] + actual)) {
            // 수치 보정은 중립으로 두되, 서로 다른 원본 굴림/템플릿 조각은 구별합니다.
            var alternatives = [record.defaults[name]];
            (record.contract.fields || []).forEach(function (field) {
              if (!field.section && field.name === name)
                alternatives = alternatives.concat(field.defaultVariants || []);
            });
            alternatives = alternatives.concat(contractOptionValues((record.contract.controls || {})[name]));
            if (!alternatives.some(function (value) { return normalizedDefault(value) === actual; }))
              sourceContradictions[record.ordinal] += 1;
          }
        });
        var matched = records.filter(function (record) {
          return defaultValues[name][record.ordinal] === actualDefault;
        });
        matched.forEach(function (record) {
          scores[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: matched.map(function (record) { return record.contract.id; }) });
      }
      var strongest = Math.max.apply(Math, scores);
      var viable = records.filter(function (record) {
        return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
      });
      var band = viable.filter(function (record) {
        return strongest < 2 || scores[record.ordinal] >= strongest - 2;
      });
      active = band.length ? band : viable.length ? viable : records.slice();
      var leaders = active.filter(function (record) { return scores[record.ordinal] === strongest; });
      var nextScore = active.filter(function (record) { return scores[record.ordinal] < strongest; })
        .reduce(function (maximum, record) { return Math.max(maximum, scores[record.ordinal]); }, 0);
      if (leaders.length === 1 && strongest >= 2 && strongest - nextScore >= 2 &&
          sourceContradictions[leaders[0].ordinal] === 0 &&
          savedUnique[leaders[0].ordinal] >= 2)
        return { record: leaders[0], survivors: active, scores: scores, probes: probes, matched: true };
    }
    var candidates = records.filter(function (record) {
      return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) candidates = records.filter(function (record) {
      return sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) return { record: null, survivors: [],
      scores: scores, probes: probes, matched: false };
    var ranked = candidates.sort(function (left, right) {
      return scores[right.ordinal] - scores[left.ordinal] || left.ordinal - right.ordinal;
    });
    var bestScore = ranked.length ? scores[ranked[0].ordinal] : 0;
    var best = ranked.filter(function (record) { return scores[record.ordinal] === bestScore; });
    var runnerScore = ranked[best.length] ? scores[ranked[best.length].ordinal] : 0;
    if (best.length === 1 && bestScore >= 2 && (bestScore - runnerScore >= 2 || ranked.length === 1))
      return { record: best[0], survivors: ranked, scores: scores, probes: probes, matched: true };
    active = ranked.filter(function (record) {
      return scores[record.ordinal] >= Math.max(0, bestScore - 1);
    });
    return { record: null, survivors: active.length ? active : ranked,
      scores: scores, probes: probes, matched: false };
  }

  function roomSourceDefaultEvidence(characters, records, ownersByName) {
    var fallback = { record: null, survivors: records.slice(), scores: records.map(function () { return 0; }), probes: [], matched: false };
    var savedCounts = dictionary();
    (characters || []).forEach(function (character) { savedCounts[character.id] = 0; });
    Object.keys(ownersByName || {}).forEach(function (name) {
      Object.keys(ownersByName[name] || {}).forEach(function (characterId) {
        if (own(savedCounts, characterId)) savedCounts[characterId] += 1;
      });
    });
    var candidates = (characters || []).slice().sort(function (left, right) {
      return savedCounts[left.id] - savedCounts[right.id] ||
        trim(left.get('name')).localeCompare(trim(right.get('name')));
    });
    var character = candidates[0];
    if (!character) return fallback;
    var savedNames = dictionary();
    Object.keys(ownersByName || {}).forEach(function (name) {
      if (ownersByName[name] && ownersByName[name][character.id]) savedNames[name] = true;
    });
    var evidence = sourceDefaultEvidence(character.id, records, savedNames);
    evidence.characterId = character.id;
    return evidence;
  }

  function trieNode() {
    return { next: dictionary(), values: [] };
  }

  function trieAdd(root, value, entry) {
    var node = root;
    for (var i = 0; i < value.length; i += 1) {
      var character = value.charAt(i);
      if (!node.next[character]) node.next[character] = trieNode();
      node = node.next[character];
    }
    node.values.push(entry);
  }

  function triePrefixes(root, value) {
    var node = root;
    var result = [];
    for (var i = 0; i < value.length; i += 1) {
      node = node.next[value.charAt(i)];
      if (!node) break;
      if (node.values.length) result = result.concat(node.values);
    }
    return result;
  }

  function fieldSuffixTrie(fields) {
    var root = trieNode();
    (fields || []).forEach(function (field) {
      var suffix = '_' + field;
      trieAdd(root, suffix.split('').reverse().join(''), field);
    });
    return root;
  }

  function matchedField(root, name, prefixLength) {
    var node = root;
    var found = '';
    for (var i = name.length - 1; i >= prefixLength; i -= 1) {
      node = node.next[name.charAt(i)];
      if (!node) break;
      if (node.values.length) found = node.values[0];
    }
    return found;
  }

  function recognitionCatalog(contracts) {
    if (contractCatalogCache && contractCatalogCache.contracts.length === contracts.length &&
        contractCatalogCache.contracts.every(function (contract, index) { return contract === contracts[index]; }))
      return contractCatalogCache;
    var catalog = { contracts: contracts.slice(), records: [], exact: dictionary(), prefixes: trieNode() };
    function post(name, posting) {
      if (!name) return;
      if (!catalog.exact[name]) catalog.exact[name] = [];
      catalog.exact[name].push(posting);
    }
    contracts.forEach(function (contract, ordinal) {
      var signature = contractSignature(contract);
      var runtime = contractRuntimeIndex(contract);
      var attributes = Array.isArray(contract.attributes) ? contract.attributes.map(trim).filter(Boolean) : [];
      var globalAttributes = (Array.isArray(contract.globalAttributes) ? contract.globalAttributes : attributes)
        .map(trim).filter(Boolean);
      var globalSet = dictionary();
      globalAttributes.forEach(function (name) { globalSet[name] = true; });
      var record = {
        contract: contract,
        ordinal: ordinal,
        signature: signature,
        attributes: attributes,
        globalAttributes: globalAttributes,
        globalSet: globalSet,
        globalCount: Object.keys(globalSet).length,
        defaults: contractDefaultMap(contract),
        required: signature.entries.filter(function (entry) { return entry.required; }).map(function (entry) { return entry.name; }),
      };
      catalog.records.push(record);
      signature.entries.forEach(function (entry) {
        post(entry.name, { record: record, type: 'signature', weight: entry.weight });
      });
      Object.keys(runtime.exact).forEach(function (name) {
        post(name, { record: record, type: signature.total ? 'dependency' : 'source', key: name });
      });
      runtime.prefixes.forEach(function (prefix) {
        var section = prefix.substring(10, prefix.length - 1);
        trieAdd(catalog.prefixes, prefix, {
          record: record,
          prefix: prefix,
          section: section,
          fields: fieldSuffixTrie(runtime.sections[section] || []),
        });
      });
    });
    contractCatalogCache = catalog;
    return catalog;
  }

  function inspectContracts(characterId) {
    if (contractMatchCache.__room__) {
      if (characterId) contractMatchCache[characterId] = contractMatchCache.__room__;
      return contractMatchCache.__room__;
    }
    var defaultEvidence = { probes: [], scores: [], matched: false };
    function remember(result) {
      result.attributeCount = persistentTotal;
      result.contractCount = contracts.length;
      contractMatchCache.__room__ = result;
      if (characterId) contractMatchCache[characterId] = result;
      return result;
    }
    var roomCharacters = characterObjects();
    var liveOwners = dictionary();
    roomCharacters.forEach(function (character) { liveOwners[character.id] = true; });
    var attributes = (
      findObjs({ _type: 'attribute' }) ||
      findObjs({ type: 'attribute' }) ||
      []
    ).filter(function (attribute) {
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      return !!liveOwners[owner];
    });
    var names = dictionary();
    var ownersByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (!name) return;
      names[name] = true;
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      if (!ownersByName[name]) ownersByName[name] = dictionary();
      if (owner) ownersByName[name][owner] = true;
    });
    var contracts = sheetContracts();
    var catalog = recognitionCatalog(contracts);
    defaultEvidence = roomSourceDefaultEvidence(roomCharacters, catalog.records, ownersByName);
    var nameList = Object.keys(names);
    var persistentTotal = nameList.length;
    var repeatingTotal = nameList.filter(function (name) {
      return name.indexOf('repeating_') === 0;
    }).length;
    var stats = catalog.records.map(function () {
      return {
        signatureScore: 0, signatureSeen: dictionary(), sourceSeen: dictionary(),
        repeatingHits: 0, repeatingSections: dictionary(), support: dictionary(),
        uniqueSeen: dictionary(), uniqueOwners: dictionary(),
      };
    });
    var recognizedFieldsByOwner = dictionary();
    var compatibilityByOwner = dictionary();
    var membershipByOwner = dictionary();
    function markSupport(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.support[owner] = true; });
    }
    function markRecognized(contractsForName, name) {
      var ordinals = Object.keys(contractsForName);
      if (!ordinals.length) return;
      var membership = ordinals.join(',');
      Object.keys(ownersByName[name] || {}).forEach(function (owner) {
        recognizedFieldsByOwner[owner] = (recognizedFieldsByOwner[owner] || 0) + 1;
        if (!compatibilityByOwner[owner]) compatibilityByOwner[owner] = dictionary();
        ordinals.forEach(function (ordinal) {
          compatibilityByOwner[owner][ordinal] = (compatibilityByOwner[owner][ordinal] || 0) + 1;
        });
        if (!membershipByOwner[owner]) membershipByOwner[owner] = dictionary();
        membershipByOwner[owner][membership] = (membershipByOwner[owner][membership] || 0) + 1;
      });
    }
    function markUniqueOwners(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.uniqueOwners[owner] = true; });
    }
    nameList.forEach(function (name) {
      var exactPostings = catalog.exact[name] || [];
      var exactContracts = dictionary();
      exactPostings.forEach(function (posting) {
        exactContracts[posting.record.ordinal] = true;
        var stat = stats[posting.record.ordinal];
        if (posting.type === 'signature') {
          if (!stat.signatureSeen[name]) {
            stat.signatureSeen[name] = true;
            stat.signatureScore += posting.weight;
            markSupport(stat, name);
          }
        } else if (posting.type === 'source') {
          stat.sourceSeen[posting.key] = true;
          markSupport(stat, name);
        }
      });
      var exactOrdinals = Object.keys(exactContracts);
      if (exactOrdinals.length === 1) {
        var exactStat = stats[Number(exactOrdinals[0])];
        exactStat.uniqueSeen[name] = true;
        markUniqueOwners(exactStat, name);
        markSupport(exactStat, name);
      }
      if (name.indexOf('repeating_') !== 0) {
        markRecognized(exactContracts, name);
        return;
      }
      var matches = triePrefixes(catalog.prefixes, name);
      var seenContracts = dictionary();
      var matchedByContract = dictionary();
      for (var index = matches.length - 1; index >= 0; index -= 1) {
        var match = matches[index];
        var ordinal = match.record.ordinal;
        if (seenContracts[ordinal]) continue;
        var field = matchedField(match.fields, name, match.prefix.length);
        if (!field) continue;
        seenContracts[ordinal] = true;
        var repeatingStat = stats[ordinal];
        repeatingStat.repeatingHits += 1;
        repeatingStat.repeatingSections[match.section] = true;
        markSupport(repeatingStat, name);
        matchedByContract[ordinal] = match.prefix + field;
        if (!match.record.signature.total) repeatingStat.sourceSeen[match.prefix + field] = true;
      }
      var repeatingOrdinals = Object.keys(matchedByContract);
      repeatingOrdinals.forEach(function (ordinal) { exactContracts[ordinal] = true; });
      markRecognized(exactContracts, name);
      if (repeatingOrdinals.length === 1) {
        var repeatingOrdinal = Number(repeatingOrdinals[0]);
        stats[repeatingOrdinal].uniqueSeen[matchedByContract[repeatingOrdinal]] = true;
        markUniqueOwners(stats[repeatingOrdinal], name);
      }
    });
    var recognizedOwnerCount = Object.keys(recognizedFieldsByOwner).length;
    var compatibilityVotes = catalog.records.map(function () { return 0; });
    Object.keys(recognizedFieldsByOwner).forEach(function (owner) {
      var total = recognizedFieldsByOwner[owner];
      if (total < 2) return;
      var coverage = compatibilityByOwner[owner] || {};
      var ranked = catalog.records.map(function (record) {
        return { ordinal: record.ordinal, count: coverage[record.ordinal] || 0 };
      }).sort(function (left, right) {
        return right.count - left.count || left.ordinal - right.ordinal;
      });
      var best = ranked[0];
      var runnerUp = ranked[1] || { ordinal: -1, count: 0 };
      if (!best || best.count / total < 0.9 || best.count <= runnerUp.count) return;
      var bestOnly = 0;
      var runnerOnly = 0;
      Object.keys(membershipByOwner[owner] || {}).forEach(function (membership) {
        var members = (',' + membership + ',');
        var count = membershipByOwner[owner][membership];
        var hasBest = members.indexOf(',' + best.ordinal + ',') >= 0;
        var hasRunner = members.indexOf(',' + runnerUp.ordinal + ',') >= 0;
        if (hasBest && !hasRunner) bestOnly += count;
        if (hasRunner && !hasBest) runnerOnly += count;
      });
      var completeFieldAdvantage = total >= 5 && best.count === total && bestOnly >= 1 && runnerOnly === 0;
      if (completeFieldAdvantage || (total >= 5 && bestOnly >= 2 && bestOnly > runnerOnly))
        compatibilityVotes[best.ordinal] += 1;
    });
    var scored = catalog.records.map(function (record) {
      var contract = record.contract;
      var signature = record.signature;
      var stat = stats[record.ordinal];
      var signatureScore = stat.signatureScore;
      var sourceScore = Object.keys(stat.sourceSeen).length;
      var missingRequired = record.required.filter(function (name) { return !stat.signatureSeen[name]; });
      var contractAttributes = record.attributes;
      var repeatingHits = stat.repeatingHits;
      var repeatingSections = stat.repeatingSections;
      var supportCount = Object.keys(stat.support).length;
      var uniqueEvidence = Object.keys(stat.uniqueSeen).length;
      var uniqueOwnerCount = Object.keys(stat.uniqueOwners).length;
      var useSignature = signature.total > 0;
      var score = useSignature ? signatureScore : sourceScore;
      var total = useSignature ? signature.total : contractAttributes.length;
      var minimum = useSignature ? signature.minimum : Math.min(3, total);
      var ratio = total ? score / total : 0;
      var structuralMatch = useSignature || ratio >= 0.6 || (score >= 6 && ratio >= 0.4);
      var repeatingRatio = repeatingTotal ? repeatingHits / repeatingTotal : 1;
      var rankScore = score + repeatingHits * 2 + Object.keys(repeatingSections).length * 3;
      return {
        contract: contract,
        id: contract.id,
        name: contract.name || contract.id,
        score: score,
        ratio: ratio,
        repeatingHits: repeatingHits,
        repeatingTotal: repeatingTotal,
        repeatingRatio: repeatingRatio,
        supportCount: supportCount,
        uniqueEvidence: uniqueEvidence,
        uniqueOwnerCount: uniqueOwnerCount,
        compatibilityOwnerCount: compatibilityVotes[record.ordinal],
        defaultMatchCount: defaultEvidence.scores[record.ordinal] || 0,
        rankScore: rankScore,
        minimum: minimum,
        missingRequired: missingRequired,
        eligible: total > 0 && missingRequired.length === 0 && score >= minimum && structuralMatch,
      };
    }).sort(function (a, b) {
      return b.compatibilityOwnerCount - a.compatibilityOwnerCount ||
        b.supportCount - a.supportCount || b.uniqueEvidence - a.uniqueEvidence || b.rankScore - a.rankScore ||
        b.repeatingHits - a.repeatingHits || b.score - a.score || b.ratio - a.ratio;
    });
    if (defaultEvidence.matched) {
      var match = scored.filter(function (item) {
        return item.id === defaultEvidence.record.contract.id;
      })[0];
      return remember({ status: 'matched', contract: defaultEvidence.record.contract,
        match: match, matches: scored, recognitionReason: 'source-defaults' });
    }
    var sourceSurvivors = dictionary();
    (defaultEvidence.survivors || []).forEach(function (record) { sourceSurvivors[record.contract.id] = true; });
    var sourceSurvivorCount = Object.keys(sourceSurvivors).length;
    var sourceNarrowed = sourceSurvivorCount < catalog.records.length;
    var selection = sourceNarrowed
      ? scored.filter(function (item) { return sourceSurvivors[item.id]; })
      : scored;
    var selectedRecords = dictionary();
    var selectedGlobal = dictionary();
    selection.forEach(function (item) {
      var record = catalog.records.filter(function (record) {
        return record.contract.id === item.id;
      })[0];
      selectedRecords[item.id] = record;
      (record ? record.globalAttributes : []).forEach(function (name) { selectedGlobal[name] = true; });
    });
    var structureVotes = dictionary();
    var structureVoters = 0;
    Object.keys(liveOwners).forEach(function (owner) {
      var observed = dictionary();
      Object.keys(ownersByName).forEach(function (name) {
        if (!ownersByName[name][owner] || name.indexOf('repeating_') === 0 ||
            name.indexOf('_reporder_repeating_') === 0) return;
        if (selectedGlobal[name]) observed[name] = true;
      });
      var observedNames = Object.keys(observed);
      var observedCount = observedNames.length;
      if (observedCount < 5) return;
      var ranked = selection.map(function (item) {
        var record = selectedRecords[item.id];
        var declared = record ? record.globalSet : dictionary();
        var declaredCount = record ? record.globalCount : 0;
        var hits = observedNames.filter(function (name) { return declared[name]; }).length;
        var union = observedCount + declaredCount - hits;
        return {
          id: item.id,
          score: union ? hits / union : 0,
          observedCoverage: hits / observedCount,
          declaredCoverage: declaredCount ? hits / declaredCount : 0,
        };
      }).sort(function (left, right) { return right.score - left.score; });
      var bestStructure = ranked[0];
      var runnerStructure = ranked[1] || { score: 0 };
      if (!bestStructure || bestStructure.score < 0.9 || bestStructure.observedCoverage < 0.9 ||
          bestStructure.declaredCoverage < 0.9 || bestStructure.score - runnerStructure.score < 0.05) return;
      structureVotes[bestStructure.id] = (structureVotes[bestStructure.id] || 0) + 1;
      structureVoters += 1;
    });
    var structureWinner = selection.filter(function (item) {
      return (structureVotes[item.id] || 0) * 2 > structureVoters;
    });
    if (structureVoters && structureWinner.length === 1)
      return remember({ status: 'matched', contract: structureWinner[0].contract,
        match: structureWinner[0], matches: selection, recognitionReason: 'stored-structure' });
    var compatibilityWinner = selection.filter(function (item) {
      return item.compatibilityOwnerCount * 2 > recognizedOwnerCount;
    });
    if (compatibilityWinner.length === 1)
      return remember({ status: 'matched', contract: compatibilityWinner[0].contract,
        match: compatibilityWinner[0], matches: selection, recognitionReason: 'stored-attributes' });
    var eligible = selection.filter(function (item) { return item.eligible; });
    if (!eligible.length) {
      if (!selection.length) return remember({ status: 'none', contract: null, matches: [],
        recognitionReason: contracts.length ? 'conflicting-source-fields' : 'no-contracts' });
      var evidence = selection[0];
      var runnerUp = selection[1];
      if (!sourceNarrowed && evidence.uniqueEvidence >= 2 && (!runnerUp ||
          evidence.supportCount > runnerUp.supportCount || runnerUp.uniqueEvidence === 0) &&
          evidence.uniqueOwnerCount * 2 > recognizedOwnerCount)
        return remember({ status: 'matched', contract: evidence.contract, match: evidence, matches: selection,
          recognitionReason: 'stored-unique-attributes' });
      return remember({
        status: 'ambiguous', contract: null, matches: selection,
        error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous'
          : persistentTotal ? 'insufficient-or-conflicting-evidence' : 'no-saved-attributes-or-default-match',
      });
    }
    var best = eligible[0];
    if (best.supportCount * 2 <= recognizedOwnerCount) {
      return remember({ status: 'ambiguous', contract: null, matches: selection, error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous' : 'insufficient-room-support' });
    }
    var close = eligible.filter(function (item) {
      return item.supportCount === best.supportCount && best.rankScore - item.rankScore <= 2 &&
        best.ratio - item.ratio < 0.1 && Math.abs(best.repeatingHits - item.repeatingHits) <= 1;
    });
    if (close.length === 1)
      return remember({ status: 'matched', contract: best.contract, match: best, matches: selection,
        recognitionReason: 'stored-signature' });
    return remember({ status: 'ambiguous', contract: null, matches: close, error: SHEET_NOT_RECOGNIZED,
      recognitionReason: sourceNarrowed
        ? 'source-defaults-ambiguous' : 'conflicting-candidates' });
  }

  function usableContractInspection(inspection) {
    return !!inspection && (inspection.status === 'matched' ||
      (inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'));
  }

  function sourceCandidateInspections(inspection) {
    if (!usableContractInspection(inspection)) return [];
    if (inspection.status === 'matched') return [inspection];
    return (inspection.matches || []).map(function (match) {
      return { status: 'matched', contract: match.contract, match: match, matches: inspection.matches };
    });
  }

  function contractControlList(source) {
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];
    return Object.keys(source).map(function (name) {
      var value = source[name];
      if (value && typeof value === 'object' && !Array.isArray(value))
        return merge({ name: name }, value);
      return { name: name, options: Array.isArray(value) ? value : [value] };
    });
  }

  function contractControls(contract, roll) {
    var controls = contractControlList(contract && contract.controls);
    contractControlList(roll && roll.controls).forEach(function (local) {
      var name = trim(local && (local.name || local.attr || local.key));
      controls = controls.filter(function (control) {
        return trim(control && (control.name || control.attr || control.key)) !== name;
      });
      controls.push(local);
    });
    return controls;
  }

  function contractControlName(control) {
    return trim(control && (control.name || control.attr || control.key));
  }

  function contractVisibilityResult(condition, valueReader) {
    if (!condition || typeof condition !== 'object') return null;
    if (condition.never === true) return false;
    if (Array.isArray(condition.all)) {
      if (!condition.all.length) return null;
      var allUnknown = false;
      for (var allIndex = 0; allIndex < condition.all.length; allIndex += 1) {
        var allValue = contractVisibilityResult(condition.all[allIndex], valueReader);
        if (allValue === false) return false;
        if (allValue === null) allUnknown = true;
      }
      return allUnknown ? null : true;
    }
    if (Array.isArray(condition.any)) {
      if (!condition.any.length) return null;
      var anyUnknown = false;
      for (var anyIndex = 0; anyIndex < condition.any.length; anyIndex += 1) {
        var anyValue = contractVisibilityResult(condition.any[anyIndex], valueReader);
        if (anyValue === true) return true;
        if (anyValue === null) anyUnknown = true;
      }
      return anyUnknown ? null : false;
    }
    if (condition.not) {
      var negated = contractVisibilityResult(condition.not, valueReader);
      return negated === null ? null : !negated;
    }
    var name = trim(condition.name);
    var op = trim(condition.op).toLowerCase();
    if (!name || !op || typeof valueReader !== 'function') return null;
    var resolved = valueReader(name, condition);
    if (!resolved || resolved.known !== true) return null;
    var actual = String(resolved.value == null ? '' : resolved.value);
    var expected = String(condition.value == null ? '' : condition.value);
    var matched;
    if (op === 'eq' || op === 'not-eq' || op === 'neq') matched = actual === expected;
    else if (op === 'starts' || op === 'not-starts') matched = actual.indexOf(expected) === 0;
    else if (op === 'ends' || op === 'not-ends') matched = expected === '' || actual.slice(actual.length - expected.length) === expected;
    else if (op === 'contains' || op === 'not-contains') matched = actual.indexOf(expected) > -1;
    else if (op === 'token' || op === 'not-token') matched = actual.split(/\s+/).indexOf(expected) > -1;
    else if (op === 'dash' || op === 'not-dash') matched = actual === expected || actual.indexOf(expected + '-') === 0;
    else return null;
    return op.indexOf('not-') === 0 || op === 'neq' ? !matched : matched;
  }

  function contractVisibilityNames(condition, found) {
    found = found || dictionary();
    if (!condition || typeof condition !== 'object') return found;
    if (Array.isArray(condition)) {
      condition.forEach(function (item) { contractVisibilityNames(item, found); });
      return found;
    }
    if (condition.name) found[trim(condition.name)] = true;
    ['all', 'any', 'not'].forEach(function (key) { contractVisibilityNames(condition[key], found); });
    return found;
  }

  function contractOptionValues(control) {
    var source = control && (control.options || control.values);
    if (!Array.isArray(source) && source && typeof source === 'object') {
      source = Object.keys(source).map(function (key) {
        var option = source[key];
        return option && typeof option === 'object' ? option : { label: key, value: option };
      });
    }
    return (Array.isArray(source) ? source : []).map(function (option) {
      return String(option && typeof option === 'object' && own(option, 'value') ? option.value : option);
    });
  }

  function contractOverrides(mode) {
    var source = mode && mode.overrides;
    var result = dictionary();
    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        var name = trim(entry && (entry.name || entry.attr || entry.key));
        if (name && own(entry, 'value')) result[name] = String(entry.value);
      });
    } else if (source && typeof source === 'object') {
      Object.keys(source).forEach(function (name) { result[name] = String(source[name]); });
    }
    return result;
  }

  function contractQueries(mode) {
    var source = mode && mode.queries;
    var result = [];
    if (Array.isArray(source)) result = source;
    else if (source && typeof source === 'object') {
      result = Object.keys(source).map(function (name) {
        var entry = source[name];
        return entry && typeof entry === 'object'
          ? merge({ name: name }, entry)
          : { name: name, value: entry };
      });
    }
    return result.map(function (entry) {
      var name = trim(entry && (entry.name || entry.label || entry.key));
      var duplicate = name.match(/#(\d+)$/);
      return {
        name: duplicate ? trim(name.substring(0, duplicate.index)) : name,
        occurrence: duplicate ? Number(duplicate[1]) : 1,
        raw: String(entry && (entry.raw || entry.query || entry.token) || ''),
        value: String(entry && own(entry, 'value') ? entry.value : ''),
      };
    }).filter(function (entry) { return entry.raw || entry.name; });
  }

  function contractOverridesValid(contract, roll, mode) {
    var controls = contractControls(contract, roll);
    var overrides = contractOverrides(mode);
    return Object.keys(overrides).every(function (name) {
      var control = controls.filter(function (candidate) {
        return contractControlName(candidate) === name;
      })[0];
      return !!control && contractOptionValues(control).indexOf(String(overrides[name])) > -1;
    });
  }

  function contractRefName(ref) {
    return trim(typeof ref === 'string' ? ref : ref && (ref.name || ref.attr || ref.key));
  }

  function contractRepeating(roll) {
    var source = roll && roll.repeating;
    if (!source) return null;
    function sectionName(value) { return trim(value).replace(/^repeating_/i, ''); }
    if (typeof source === 'string') return { section: sectionName(source), fields: [], source: trim(source) };
    return {
      section: sectionName(source.section || source.name),
      fields: Array.isArray(source.fields) ? source.fields.map(contractRefName).filter(Boolean) : [],
      source: trim(source.section || source.name),
    };
  }

  function contractSections(contract) {
    var source = contract && contract.sections;
    var sections = dictionary();
    if (!source || typeof source !== 'object' || Array.isArray(source)) return sections;
    Object.keys(source).forEach(function (section) {
      var name = trim(section).replace(/^repeating_/i, '');
      var fields = Array.isArray(source[section]) ? source[section].map(contractRefName).filter(Boolean) : [];
      if (name && fields.length) sections[name] = fields;
    });
    return sections;
  }

  function contractRollFields(contract, roll, controlMap) {
    var repeating = contractRepeating(roll);
    if (!repeating) return [];
    var fields = repeating.fields.slice();
    [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
      (Array.isArray(refs) ? refs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        var rowLocal = typeof ref === 'object' && (ref.row === true || ref.repeating === true || ref.scope === 'row');
        var control = controlMap && controlMap[name];
        if (!control) control = contractControls(contract, roll).filter(function (candidate) {
          return contractControlName(candidate) === name;
        })[0];
        var controlSection = trim(control && control.repeating).replace(/^repeating_/i, '');
        if (name && (rowLocal || controlSection === repeating.section) && fields.indexOf(name) < 0) fields.push(name);
      });
    });
    return fields;
  }

  function contractRowAttr(contract, roll, row, name) {
    if (!row) return name;
    var index = contractRuntimeIndex(contract);
    var fields = index.rollFields[roll.key] || contractRollFields(contract, roll, index.controls);
    return fields.indexOf(name) > -1 ? (row.refs[name] || row.names[name] || name) : name;
  }

  function contractLabelRef(characterId, contract, roll, row, ref, reader) {
    var name = contractRefName(ref);
    if (!name) return '';
    var fullName = contractRowAttr(contract, roll, row, name);
    var value = reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current');
    var index = contractRuntimeIndex(contract);
    var repeating = contractRepeating(roll);
    var field = repeating && index.fieldSections[repeating.section] && index.fieldSections[repeating.section][name] ||
      index.fieldGlobal[name];
    return trim(field && field.defaultVariants
      ? contractUnsavedFieldValue(field, value, field.default, ref && ref.max) : value);
  }

  function contractStaticLabels(roll) {
    var source = roll && roll.staticLabels;
    return (Array.isArray(source) ? source : source ? [source] : []).map(function (entry) {
      return trim(entry && typeof entry === 'object' ? entry.value : entry);
    }).filter(Boolean);
  }

  function contractModeLabels(mode) {
    var labels = [mode && mode.label].concat(mode && mode.aliases || []);
    var path = mode && mode.labelPath;
    if (Array.isArray(path)) {
      if (path.length) labels.push(path.join(' '));
      labels = labels.concat(path.slice().reverse());
    } else if (path) {
      labels.push(path);
      labels = labels.concat(String(path).split(/\s*(?:>|\/|\||::)\s*/));
    }
    labels.push(mode && mode.id);
    var found = dictionary();
    return labels.map(trim).filter(function (label) {
      var key = normalize(label);
      if (!key || found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractUserModeLabels(mode) {
    var internalId = normalize(mode && mode.id);
    return contractModeLabels(mode).filter(function (label) {
      var key = normalize(label);
      return key && key !== internalId && !/^mode-?[a-f0-9]{8,}$/i.test(key) &&
        humanContractLabel(label) && !/[?@%&]\{|\{\{|\[\[/.test(label);
    });
  }

  function contractRuntimeIndex(contract) {
    var key = String(contract.id) + '|' + String(contract.sourceHash || '') + '|' + contract.rolls.length;
    var cached = contractIndexCache[key];
    if (cached && cached.contract === contract) return cached;
    var index = {
      contract: contract,
      controls: dictionary(),
      exact: dictionary(),
      prefixes: [],
      sections: dictionary(),
      rollFields: dictionary(),
      rollControls: dictionary(),
      rollsByKey: dictionary(),
      labelRefFrequency: dictionary(),
      fieldGlobal: dictionary(),
      fieldSections: dictionary(),
      fieldPrefixes: trieNode(),
      presentationControls: dictionary(),
      presentationRollGates: dictionary(),
      rollVisibilityReach: dictionary(),
    };
    var visibilityReach = dictionary();
    var visibilityConditions = [];
    var visibilityNames = [];
    var rollVisibilityPolarity = dictionary();
    var valueReferences = dictionary();
    function countVisibility(condition) {
      if (!condition) return;
      var index = visibilityConditions.indexOf(condition);
      if (index < 0) {
        index = visibilityConditions.length;
        visibilityConditions.push(condition);
        visibilityNames.push(Object.keys(contractVisibilityNames(condition)));
      }
      visibilityNames[index].forEach(function (name) {
        visibilityReach[name] = (visibilityReach[name] || 0) + 1;
      });
    }
    function countRollVisibility(condition, negated) {
      if (!condition || typeof condition !== 'object') return;
      if (Array.isArray(condition)) {
        condition.forEach(function (item) { countRollVisibility(item, negated); });
        return;
      }
      if (condition.not) countRollVisibility(condition.not, !negated);
      if (condition.name && condition.op) {
        var name = trim(condition.name);
        var op = trim(condition.op).toLowerCase();
        var negative = op.indexOf('not-') === 0 || op === 'neq';
        var polarity = negative !== !!negated ? 'negative' : 'positive';
        if (!rollVisibilityPolarity[name])
          rollVisibilityPolarity[name] = {
            positive: false,
            negative: false,
            positiveValues: dictionary(),
            positiveEqualityOnly: true,
          };
        rollVisibilityPolarity[name][polarity] = true;
        if (polarity === 'positive') {
          rollVisibilityPolarity[name].positiveEqualityOnly =
            rollVisibilityPolarity[name].positiveEqualityOnly && op === 'eq';
          if (own(condition, 'value'))
            rollVisibilityPolarity[name].positiveValues[String(condition.value)] = true;
        }
      }
      ['all', 'any'].forEach(function (key) { countRollVisibility(condition[key], negated); });
    }
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      if (!field.section) {
        index.fieldGlobal[trim(field.name)] = field;
        index.exact[trim(field.name)] = true;
      }
      else {
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (!index.fieldSections[section]) index.fieldSections[section] = dictionary();
        index.fieldSections[section][trim(field.name)] = field;
      }
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      function addDependency(name, scope) {
        name = trim(name);
        if (!name) return;
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (section && scope !== 'global' && index.fieldSections[section] && index.fieldSections[section][name]) return;
        index.exact[name] = true;
      }
      [field.default, field.max].forEach(function (source) {
        String(source == null ? '' : source).replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (token, name) {
          valueReferences[trim(name)] = true;
          addDependency(name, '');
          return token;
        });
      });
      (function visit(condition) {
        if (!condition || typeof condition !== 'object') return;
        if (Array.isArray(condition)) {
          condition.forEach(visit);
          return;
        }
        if (condition.name) addDependency(condition.name, trim(condition.scope).toLowerCase());
        ['all', 'any', 'not'].forEach(function (key) { visit(condition[key]); });
      })(field.visibility);
      countVisibility(field.visibility);
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      var prefix = 'repeating_' + section + '_';
      trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    contractControls(contract).forEach(function (control) {
      var name = contractControlName(control);
      if (name) {
        index.controls[name] = control;
        index.exact[name] = true;
      }
    });
    var exactAttributes = Array.isArray(contract.globalAttributes) ? contract.globalAttributes : contract.attributes;
    (Array.isArray(exactAttributes) ? exactAttributes : []).forEach(function (name) {
      name = trim(name);
      if (name) index.exact[name] = true;
    });
    contractSignature(contract).entries.forEach(function (entry) { index.exact[entry.name] = true; });
    var declaredSections = contractSections(contract);
    Object.keys(declaredSections).forEach(function (section) {
      index.sections[section] = declaredSections[section].slice();
      index.prefixes.push('repeating_' + section + '_');
      index.exact['_reporder_repeating_' + section] = true;
    });
    contract.rolls.forEach(function (roll) {
      if (!roll) return;
      var rollKey = String(roll.key);
      if (!own(index.rollsByKey, rollKey)) index.rollsByKey[rollKey] = roll;
      countVisibility(roll.visibility);
      countRollVisibility(roll.visibility, false);
      Object.keys(contractVisibilityNames(roll.visibility)).forEach(function (name) {
        index.rollVisibilityReach[name] = (index.rollVisibilityReach[name] || 0) + 1;
      });
      var scopedControls = dictionary();
      contractControls(contract, roll).forEach(function (control) {
        var name = contractControlName(control);
        if (name) scopedControls[name] = control;
      });
      var repeating = contractRepeating(roll);
      var fields = repeating ? contractRollFields(contract, roll, scopedControls) : [];
      function addExact(name) {
        if (name && (!repeating || fields.indexOf(name) < 0)) index.exact[name] = true;
      }
      (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) index.labelRefFrequency[name] = (index.labelRefFrequency[name] || 0) + 1;
      });
      [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
        (Array.isArray(refs) ? refs : []).forEach(function (ref) {
          var name = contractRefName(ref);
          if (name) valueReferences[name] = true;
          addExact(name);
        });
      });
      (roll.modes || []).forEach(function (mode) {
        Object.keys(mode && mode.overrides || {}).forEach(function (name) { valueReferences[name] = true; });
      });
      Object.keys(scopedControls).forEach(function (name) {
        addExact(name);
      });
      index.rollControls[roll.key] = scopedControls;
      if (!repeating || !repeating.section) return;
      if (!index.sections[repeating.section]) {
        index.sections[repeating.section] = [];
        index.prefixes.push('repeating_' + repeating.section + '_');
        index.exact['_reporder_repeating_' + repeating.section] = true;
      }
      index.rollFields[roll.key] = fields;
      fields.forEach(function (field) {
        if (index.sections[repeating.section].indexOf(field) < 0) index.sections[repeating.section].push(field);
      });
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || field.section || !/^(?:checkbox|radio)$/i.test(trim(field.type))) return;
      if ((visibilityReach[field.name] || 0) > 1 && !valueReferences[field.name])
        index.presentationControls[field.name] = true;
    });
    Object.keys(index.presentationControls).forEach(function (name) {
      var polarity = rollVisibilityPolarity[name];
      var field = index.fieldGlobal[name];
      var positiveValues = polarity ? Object.keys(polarity.positiveValues || {}) : [];
      var onValue = field && own(field, 'onValue') ? String(field.onValue) : '';
      var positiveCollapsedPanel = polarity && polarity.positive && !polarity.negative &&
        polarity.positiveEqualityOnly && positiveValues.length === 1 &&
        (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length &&
        field && trim(field.default) === '' && onValue !== '' && positiveValues[0] === onValue;
      if ((polarity && polarity.negative && !polarity.positive &&
          (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length) ||
          positiveCollapsedPanel)
        index.presentationRollGates[name] = true;
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      if (!index.sections[section]) index.sections[section] = [];
      Object.keys(index.fieldSections[section]).forEach(function (field) {
        if (index.sections[section].indexOf(field) < 0) index.sections[section].push(field);
      });
      var prefix = 'repeating_' + section + '_';
      if (index.prefixes.indexOf(prefix) < 0) index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + section] = true;
    });
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
    });
    index.prefixes.sort(function (left, right) { return right.length - left.length; });
    contractIndexCache[key] = index;
    return index;
  }

  function humanContractLabel(value) {
    var label = trim(value);
    return !!label && label.length <= 100 &&
      !!label.replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '') &&
      !/^(?:true|false|on|off|null|none)$/i.test(label);
  }

  function contractDisplayLabel(value) {
    var label = trim(value).replace(/^븿\s*/, '');
    if (!humanContractLabel(label)) return '';
    if (/^[\d.,%()+\-*/]+$/.test(label) || /^\d*d\d+(?:[+\-*/]\d+(?:\.\d+)?)?$/i.test(label)) return '';
    if (/^mode-?[a-f0-9]{8,}$/i.test(label) || /^roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^repeating_[^.]+\.roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^[A-Za-z0-9_$-]+_(?:check|roll|attack|damage|u)$/i.test(label)) return '';
    return label;
  }

  function contractRolls(characterId, inspection, objects, includeHidden, readLive) {
    inspection = inspection || inspectContracts(characterId, objects);
    if (!inspection || inspection.status !== 'matched') return [];
    var contract = inspection.contract;
    var attributes = objects || attrObjects(characterId);
    var index = contractRuntimeIndex(contract);
    var attributeValues = dictionary();
    var readCache = dictionary();
    readLive = readLive || cachedAttrReader(characterId);
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeValues[name] = { current: attribute.get('current'), max: attribute.get('max') };
    });
    function read(name, type) {
      var key = name + '|' + type;
      if (own(readCache, key)) return readCache[key];
      if (attributeValues[name]) readCache[key] = attributeValues[name][type];
      else readCache[key] = readLive(name, type);
      return readCache[key];
    }
    var rowsBySection = dictionary();
    Object.keys(index.sections).forEach(function (sectionName) {
      rowsBySection[sectionName] = collectRows(characterId, sectionName, index.sections[sectionName], attributes, index.prefixes);
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      if (roll.visibility && roll.visibility.never === true) return;
      var repeating = contractRepeating(roll);
      var rows = repeating && repeating.section
        ? rowsBySection[repeating.section] || []
        : [null];
      rows.forEach(function (row) {
        var scopedControls = index.rollControls[roll.key] || dictionary();
        var visibility = contractVisibilityResult(roll.visibility, function (name, atom) {
          if (index.presentationRollGates[name]) return { known: false };
          var scope = trim(atom && atom.scope).toLowerCase();
          if (scope === 'row' && !row) return { known: false };
          var fullName = scope === 'global' ? name : contractRowAttr(contract, roll, row, name);
          var control = scope === 'global' ? index.controls[name] : scopedControls[name] || index.controls[name];
          var hasValue = own(attributeValues, fullName);
          var liveValue = hasValue ? attributeValues[fullName].current : read(fullName, 'current');
          hasValue = hasValue || liveValue !== undefined && liveValue !== null && String(liveValue) !== '';
          if (hasValue) {
            var options = contractOptionValues(control);
            var validatesOptions = options.length > 1 ||
              /^(?:select|radio)$/i.test(trim(control && control.type));
            if (!validatesOptions || !options.length || options.indexOf(String(liveValue)) > -1)
              return { known: true, value: liveValue };
            return control && own(control, 'default')
              ? { known: true, value: control.default }
              : { known: false };
          }
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        });
        if (visibility === false && !includeHidden) return;
        var rawVisible = trim(roll.label);
        var visible = contractDisplayLabel(rawVisible);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        if (!visible && rawVisible && !repeating) {
          var sourceGroups = dictionary();
          String(roll.raw || '').replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (match, name) {
            var field = index.fieldGlobal[name];
            var group = contractDisplayLabel(field && field.numericCandidate ? field.groupLabel : '');
            if (group) sourceGroups[normalize(group)] = group;
            return match;
          });
          var sourceGroupKeys = Object.keys(sourceGroups);
          if (sourceGroupKeys.length === 1) visible = sourceGroups[sourceGroupKeys[0]];
        }
        var dynamic = [];
        var expressionNames = (Array.isArray(roll.expressionRefs) ? roll.expressionRefs : []).map(contractRefName);
        var titleRefs = dictionary();
        var sourceTitleLabels = dictionary();
        var sectionFields = repeating && index.fieldSections[repeating.section] || dictionary();
        var titleValue = '';
        var expressionLabels = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          var refName = contractRefName(ref);
          var sourceField = sectionFields[refName] || index.fieldGlobal[refName] || scopedControls[refName];
          if (expressionNames.indexOf(refName) < 0 && sourceField &&
            /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
            /^(?:text|textarea)$/i.test(trim(sourceField.type)) && !sourceField.hidden &&
            !sourceField.readonly && !sourceField.disabled && !trim(sourceField.default) &&
            // ponytail: 이름칸은 굴림 4개까지만; 더 공유하면 상한 확대.
            (index.labelRefFrequency[refName] || 0) <= 4) {
            var fieldLabels = [sourceField.label].concat(sourceField.aliases || []).map(normalize).filter(Boolean);
            var rawKey = normalize(rawVisible).replace(/(?:name|check|roll)$/i, '');
            var refKey = normalize(refName).replace(/(?:name|check|roll)$/i, '');
            var machineNamed = (normalize(rawVisible) === normalize(roll.name) || normalize(rawVisible) === normalize(roll.key)) &&
              rawKey && refKey && (rawKey.indexOf(refKey) > -1 || refKey.indexOf(rawKey) > -1);
            var editableTitle = /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              /(?:^|_)(?:name|title|label)(?:_|$)/i.test(refName);
            if (fieldLabels.indexOf(normalize(rawVisible)) > -1 || machineNamed || editableTitle) {
              titleRefs[refName] = true;
              fieldLabels.forEach(function (label) { sourceTitleLabels[label] = true; });
            }
          }
          if (expressionNames.indexOf(refName) > -1) {
            var sourceLabel = contractDisplayLabel(sourceField && sourceField.label);
            if (sourceLabel && normalize(sourceLabel) !== normalize(refName)) expressionLabels.push(sourceLabel);
            return;
          }
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (titleRefs[refName] && value && !titleValue) titleValue = value;
          if (value) dynamic.push({
            value: value,
            frequency: index.labelRefFrequency[refName] || 0,
            title: !!titleRefs[refName],
            subject: /^(?:name|subject|title|label|skill|skill_name|attribute)$/i.test(trim(ref && ref.field)) &&
              sourceField && /^(?:text|textarea)$/i.test(trim(sourceField.type)),
          });
        });
        if (Object.keys(titleRefs).length) {
          if (!titleValue) return;
          rawVisible = '';
          visible = '';
          staticLabels = staticLabels.filter(function (label) { return !sourceTitleLabels[normalize(label)]; });
        }
        dynamic.sort(function (left, right) {
          return Number(!!right.title) - Number(!!left.title) || left.frequency - right.frequency;
        });
        var usefulDynamic = dynamic.filter(function (entry) { return normalize(entry.value) !== characterName; });
        var rowLabels = usefulDynamic.map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var subjectLabels = usefulDynamic.filter(function (entry) { return entry.subject; })
          .map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var displayLabels = (row && rowLabels.length ? rowLabels :
          !roll.name && !staticLabels.length && subjectLabels.length ? subjectLabels : [visible])
          .concat(staticLabels.map(contractDisplayLabel).filter(Boolean))
          .concat(expressionLabels)
          .concat(row ? [visible] : rowLabels)
          .map(trim).filter(Boolean);
        if (!displayLabels.length && expressionNames.length === 1) displayLabels.push('자유 주사위');
        var labels = displayLabels
          .concat([rawVisible])
          .concat((roll.aliases || []).filter(function (label) { return !sourceTitleLabels[normalize(label)]; }))
          .concat(staticLabels)
          .concat(expressionNames.length === 1 ? ['자유 주사위', expressionNames[0]] : [])
          .concat([roll.name, roll.key])
          .map(trim).filter(Boolean);
        var unique = dictionary();
        labels = labels.filter(function (label) {
          var key = normalize(label);
          if (!key || unique[key]) return false;
          unique[key] = true;
          return true;
        });
        result.push({
          characterId: characterId,
          contract: contract,
          roll: roll,
          row: row,
          key: roll.key + (row ? '@' + row.id : ''),
          label: displayLabels[0] || '',
          aliases: labels,
          modes: Array.isArray(roll.modes) ? roll.modes : [],
          hidden: visibility === false,
        });
      });
    });
    return result;
  }

  function actionableContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched') return scannedContractRolls(characterId, includeHidden);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    objects = objects || attrObjects(characterId);
    readLive = readLive || cachedAttrReader(characterId);
    var rolls = [];
    candidates.forEach(function (candidate) {
      rolls = rolls.concat(contractRolls(characterId, candidate, objects, includeHidden, readLive));
    });
    return rolls;
  }

  function contractFieldMatch(index, name) {
    if (index.fieldGlobal[name]) return { field: index.fieldGlobal[name], name: name, rowId: '' };
    var matches = triePrefixes(index.fieldPrefixes, name);
    for (var i = matches.length - 1; i >= 0; i -= 1) {
      var match = matches[i];
      var fieldName = matchedField(match.fields, name, match.prefix.length);
      if (!fieldName) continue;
      var suffix = '_' + fieldName;
      var rowId = name.substring(match.prefix.length, name.length - suffix.length);
      if (!rowId) continue;
      return {
        field: index.fieldSections[match.section][fieldName],
        name: name,
        rowId: rowId,
        section: match.section,
      };
    }
    return null;
  }

  function localFieldLabel(field) {
    var label = contractDisplayLabel(field && field.label);
    var group = contractDisplayLabel(field && field.groupLabel);
    if (!group) return label;
    var groupKey = normalize(group);
    var candidates = [label].concat(field && field.aliases || []).map(contractDisplayLabel);
    for (var index = 0; index < candidates.length; index += 1) {
      var key = normalize(candidates[index]);
      if (groupKey && key.indexOf(groupKey) === 0) key = key.slice(groupKey.length);
      else if (groupKey && key.slice(-groupKey.length) === groupKey) key = key.slice(0, -groupKey.length);
      if (/^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(key)) return '현재';
      if (/^(?:최대|maximum|max)(?:값|수치|점수|value|score)?$/i.test(key)) return '최대';
      if (/^(?:시작|초기|start|starting|initial)(?:값|수치|점수|value|score)?$/i.test(key)) return '시작';
      if (/^(?:45|80%|threshold|문턱값|기준값)$/i.test(key)) return '4/5';
    }
    return label;
  }

  function fieldChoiceLegend(value) {
    return /(?:^|\s)-?\d+(?:\.\d+)?\s*=\s*\S+/.test(trim(value));
  }

  function fieldRangeOnly(value) {
    return /^\(?\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)?$/i.test(trim(value));
  }

  function cleanFieldRange(value) {
    return trim(value).replace(/\s*\(\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)\s*$/i, '');
  }

  function fieldLabel(field, rowLabel) {
    var name = trim(field && field.name);
    var label = localFieldLabel(field) || name;
    var group = contractDisplayLabel(field && field.groupLabel);
    var role = normalize(label);
    var generic = /^(?:현재|최대|current|maximum|max|value|score|값|수치|점수)$/i;
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) {
      var sourceLabel = contractDisplayLabel(field && field.label);
      label = /^(?:현재|current|now).+|.+(?:현재|current|now)$/i.test(normalize(sourceLabel)) &&
        normalize(sourceLabel) !== normalize(name) && !generic.test(normalize(sourceLabel))
        ? sourceLabel : group;
    }
    else if (group && /^(?:최대|maximum|max|시작|초기|start|starting|initial|45|80%|threshold|문턱값|기준값)(?:값|수치|점수|value|score)?$/i.test(role))
      label = /[가-힣]/.test(label) ? label + ' ' + group : group + ' ' + label;
    if (normalize(label) === normalize(name) || generic.test(normalize(label)) || fieldChoiceLegend(label)) {
      var preferred = (field && field.aliases || []).map(contractDisplayLabel).filter(function (alias) {
        return alias && normalize(alias) !== normalize(name) && !generic.test(normalize(alias)) &&
          !fieldChoiceLegend(alias) && !fieldRangeOnly(alias);
      })[0];
      if (preferred) label = cleanFieldRange(preferred);
    }
    if (rowLabel && normalize(rowLabel) !== normalize(label)) return rowLabel + ' / ' + label;
    return rowLabel || label;
  }

  function userFacingField(field) {
    var name = trim(field && field.name);
    var label = contractDisplayLabel(field && field.label);
    if (label && (normalize(label) !== normalize(name) || /[가-힣]/.test(name))) return true;
    return (field && field.aliases || []).some(function (alias) {
      return contractDisplayLabel(alias) && normalize(alias) !== normalize(name);
    });
  }

  function numericFieldValue(characterId, value, defaults, rowContext) {
    if (value === undefined || value === null || trim(value) === '') return null;
    var resolved = resolvedResourceValue(characterId, value, defaults, rowContext);
    return resolved.number === null || !isFinite(resolved.number) ? null : resolved.number;
  }

  function fieldAliases(field, label, rowLabel, fullName) {
    var seen = dictionary();
    return [label, rowLabel, localFieldLabel(field)]
      .concat(field && field.aliases || [])
      .concat([field && field.name, fullName])
      .map(trim).filter(function (alias) {
        var key = normalize(alias);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function fieldPairLabels(field, label, rowLabel) {
    var seen = dictionary();
    var group = contractDisplayLabel(field && field.groupLabel);
    var local = localFieldLabel(field);
    return [label, rowLabel, local, group, group && local ? group + ' ' + local : '', group && local ? local + ' ' + group : '']
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function sourceFieldLabels(field, label, rowLabel) {
    var seen = dictionary();
    return fieldPairLabels(field, label, rowLabel).concat(field && field.aliases || [])
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function maximumFieldLabel(labels) {
    return (labels || []).some(function (label) {
      return /^(?:최대|maximum|max)(?:값|수치|점수)?$/i.test(normalize(label)) ||
        /^(?:최대|maximum|max).+$/i.test(normalize(label));
    });
  }

  function fieldPairKeys(labels) {
    var ignored = {
      current: true, maximum: true, max: true, value: true, score: true,
      현재: true, 최대: true, 값: true, 수치: true, 점수: true,
    };
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(label);
      var stripped = key.replace(/^(?:현재|최대|current|maximum|max)/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || ignored[candidate] || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function fieldPairNameKey(name) {
    return normalize(name)
      .replace(/^(?:현재|최대|current|maximum|max|now)/i, '')
      .replace(/(?:현재|최대|current|maximum|max|now)$/i, '');
  }

  function pairResourceMaximums(resources, references) {
    var maximumByKey = dictionary();
    var maximumByName = dictionary();
    (references || []).forEach(function (candidate, index) {
      if (!maximumFieldLabel(candidate.sourceLabels)) return;
      var nameKey = fieldPairNameKey(candidate.name);
      if (nameKey) {
        if (!maximumByName[nameKey]) maximumByName[nameKey] = [];
        maximumByName[nameKey].push({ candidate: candidate, index: index });
      }
      fieldPairKeys(candidate.pairLabels).forEach(function (key) {
        if (!maximumByKey[key]) maximumByKey[key] = [];
        maximumByKey[key].push({ candidate: candidate, index: index });
      });
    });
    (resources || []).forEach(function (item) {
      if (item.max !== null || maximumFieldLabel(item.sourceLabels)) return;
      var scores = dictionary();
      var candidates = [];
      function score(entry, amount) {
        if (entry.candidate.name === item.name) return;
        if (!scores[entry.index]) candidates.push(entry);
        scores[entry.index] = (scores[entry.index] || 0) + amount;
      }
      fieldPairKeys(item.pairLabels).forEach(function (key) {
        (maximumByKey[key] || []).forEach(function (entry) {
          score(entry, 1);
        });
      });
      (maximumByName[fieldPairNameKey(item.name)] || []).forEach(function (entry) {
        score(entry, 1000);
      });
      var best = 0;
      var match = null;
      var matchCount = 0;
      candidates.forEach(function (entry) {
        var score = scores[entry.index];
        if (score < best) return;
        if (score > best) {
          best = score;
          match = entry.candidate;
          matchCount = 1;
        } else matchCount += 1;
      });
      if (matchCount === 1) {
        item.max = match.value;
        item._maxDefinition = match._definition || '';
      }
    });
  }

  function liveResourceFields(fields) {
    var result = dictionary();
    var maximums = dictionary();
    (fields || []).filter(function (field) {
      return !field.section && !field.hidden &&
        /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) &&
        maximumFieldLabel(sourceFieldLabels(field, fieldLabel(field, ''), ''));
    }).forEach(function (field) {
      fieldPairKeys(fieldPairLabels(field, localFieldLabel(field), '')).forEach(function (key) {
        if (!maximums[key]) maximums[key] = [];
        maximums[key].push(field);
      });
    });
    (fields || []).forEach(function (field) {
      if (field.section || field.hidden || field.readonly || field.disabled || !field.numericCandidate ||
        !userFacingField(field) || !/^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) return;
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), '');
      var labels = sourceFieldLabels(field, fieldLabel(field, ''), '').concat(field.name);
      if (trim(field.max) && ['health', 'sanity', 'magicPoints'].some(function (role) {
        return matchesDetectedRole(labels, role);
      })) result[field.name] = true;
      var keys = fieldPairKeys(pairLabels);
      keys.forEach(function (key) {
        var matches = (maximums[key] || []).filter(function (maximum) { return maximum !== field; });
        if (matches.length !== 1) return;
        result[field.name] = true;
        result[matches[0].name] = true;
      });
    });
    return result;
  }

  function contractUnsavedFieldValue(field, live, fallback, maximum) {
    var variants = !maximum && Array.isArray(field && field.defaultVariants) ? field.defaultVariants : [];
    if (variants.length) fallback = variants[0];
    if (live !== undefined && live !== null && trim(live) !== '') {
      var hiddenDefault = variants.slice(1).some(function (value) {
        return trim(value) === trim(live);
      });
      if (!hiddenDefault) return live;
    }
    return fallback;
  }

  function contractFieldItems(characterId, inspection, objects, rolls, readLive, includeDefinition) {
    var result = { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    if (!inspection || inspection.status !== 'matched') return result;
    var fields = Array.isArray(inspection.contract.fields) ? inspection.contract.fields : [];
    if (!fields.length) return result;
    var index = contractRuntimeIndex(inspection.contract);
    var liveFields = liveResourceFields(fields);
    var fieldDefaults = dictionary();
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      if (own(field, 'default') && trim(field.default) !== '') fieldDefaults[field.name] = field.default;
      else if (trim(field.type).toLowerCase() === 'checkbox') fieldDefaults[field.name] = '0';
    });
    readLive = readLive || cachedAttrReader(characterId);
    var attributes = objects || attrObjects(characterId);
    var attributeByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeByName[name] = attribute;
    });
    var rowLabels = dictionary();
    (rolls || []).forEach(function (instance) {
      var repeating = instance.roll && contractRepeating(instance.roll);
      if (!instance.row || !repeating) return;
      var section = trim(repeating.section);
      var key = section + '|' + instance.row.id;
      if (!rowLabels[key] && trim(instance.label)) rowLabels[key] = trim(instance.label);
    });
    function fieldVisibility(match) {
      var condition = match.field && match.field.visibility;
      if (!condition) return true;
      return contractVisibilityResult(condition, function (name, atom) {
        var scope = trim(atom && atom.scope).toLowerCase();
        var fullName = name;
        if (scope !== 'global' && match.section && match.rowId)
          fullName = 'repeating_' + match.section + '_' + match.rowId + '_' + name;
        if (attributeByName[fullName])
          return { known: true, value: attributeByName[fullName].get('current') };
        var live = readLive(fullName, 'current');
        if (live !== undefined && live !== null && String(live) !== '')
          return { known: true, value: live };
        var sourceField = match.section && index.fieldSections[match.section]
          ? index.fieldSections[match.section][name]
          : index.fieldGlobal[name];
        if (sourceField && own(sourceField, 'default'))
          return { known: true, value: sourceField.default };
        var control = index.controls[name];
        return control && own(control, 'default')
          ? { known: true, value: control.default }
          : { known: false };
      });
    }
    function fieldRowContext(match) {
      if (!match.section || !match.rowId) return null;
      var fields = index.fieldSections[match.section] || dictionary();
      var prefix = 'repeating_' + match.section + '_' + match.rowId + '_';
      var values = dictionary();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var fullName = prefix + name;
        var attribute = attributeByName[fullName];
        var current = attribute ? attribute.get('current') : undefined;
        var maximum = attribute ? attribute.get('max') : undefined;
        if (attribute) {
          if ((current === undefined || trim(current) === '') && own(field, 'default')) current = field.default;
          if ((maximum === undefined || trim(maximum) === '') && trim(field.max)) maximum = field.max;
        } else {
          current = contractUnsavedFieldValue(field, readLive(fullName, 'current'), field.default, false);
          var liveMaximum = readLive(fullName, 'max');
          maximum = liveMaximum !== undefined && liveMaximum !== null && trim(liveMaximum) !== ''
            ? liveMaximum : field.max;
        }
        if (current !== undefined && trim(current) !== '') values[fullName + '|current'] = current;
        if (maximum !== undefined && trim(maximum) !== '') values[fullName + '|max'] = maximum;
      });
      return { scopes: [prefix], fields: fields, values: values };
    }
    function sourceFieldValue(name, valueType) {
      var attribute = attributeByName[name];
      if (attribute) return attribute.get(valueType === 'max' ? 'max' : 'current');
      var field = index.fieldGlobal[name];
      var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
      var live = readLive(name, valueType);
      if (valueType !== 'max' && field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled)
        return contractUnsavedFieldValue(field, live, fallback, false);
      return live !== undefined && live !== null && trim(live) !== '' ? live : fallback;
    }
    var valueContext = { scopes: [], values: dictionary(), resolveAttribute: sourceFieldValue };
    function add(match, attribute, fallback) {
      var field = match.field;
      if (!userFacingField(field)) return;
      var visible = fieldVisibility(match);
      if (visible === false) return;
      var fullName = match.name;
      var raw = attribute ? attribute.get('current') : fallback;
      var rowLabel = match.section ? rowLabels[match.section + '|' + match.rowId] || '' : '';
      var label = fieldLabel(field, rowLabel);
      var aliases = fieldAliases(field, label, rowLabel, fullName);
      var type = trim(field.type).toLowerCase();
      var sourceLabels = sourceFieldLabels(field, label, rowLabel);
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), rowLabel);
      var rowContext = fieldRowContext(match) || valueContext;
      rowContext.resolveAttribute = sourceFieldValue;
      var localLabel = localFieldLabel(field);
      var statusResource = !!liveFields[fullName] &&
        !/^(?:최대|시작|초기|maximum|max|start|starting|initial|45|80%|threshold|문턱값|기준값)/i.test(normalize(localLabel));
      var definition = includeDefinition ? JSON.stringify(field) : '';
      var structure = includeDefinition ? JSON.stringify([
        type, trim(field.section), !!field.numericCandidate, !!field.trackCandidate,
        !!field.readonly, !!field.disabled, !!field.hidden, trim(field.default), trim(field.max), trim(field.onValue),
        field.defaultVariants || [],
      ]) : '';
      var number = /^(?:text|number|range)$/.test(type)
        ? numericFieldValue(characterId, raw, fieldDefaults, rowContext) : null;
      var tracked = !index.presentationControls[field.name] && !!field.trackCandidate &&
        (number !== null || type === 'checkbox');
      if (tracked) result.tracked[fullName] = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        kind: type === 'checkbox' ? 'toggle' : 'number',
        onValue: trim(field.onValue),
        value: raw,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
      };
      if (number === null) return;
      var maxRaw = attribute && attribute.get('max');
      if (trim(maxRaw) === '' && trim(field.max)) {
        var liveMax = readLive(fullName, 'max');
        if (liveMax !== undefined && liveMax !== null && trim(liveMax) !== '') maxRaw = liveMax;
      }
      if (trim(maxRaw) === '') maxRaw = field.max;
      var item = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        value: number,
        max: numericFieldValue(characterId, maxRaw, fieldDefaults, rowContext),
        writable: !!field.numericCandidate,
        statusResource: statusResource,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
        _maxDefinition: trim(field.max) ? JSON.stringify(field.max) : '',
      };
      result.references.push(item);
      if (!field.numericCandidate) return;
      result.resources.push(item);
      result.byAttribute[fullName] = item;
      aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!result.aliases[key]) result.aliases[key] = [];
        result.aliases[key].push(item);
      });
    }
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      var name = trim(field.name);
      var attribute = attributeByName[name];
      if (attribute) add({ field: field, name: name, rowId: '' }, attribute);
      else if (!field.hidden && field.trackCandidate && trim(field.type).toLowerCase() === 'checkbox')
        add({ field: field, name: name, rowId: '' }, null, field.default);
      else if (!field.hidden && /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) && own(field, 'default')) {
        var fallback = field.default;
        if (liveFields[name]) {
          var live = readLive(name, 'current');
          fallback = contractUnsavedFieldValue(field, live, fallback, false);
        }
        add({ field: field, name: name, rowId: '' }, null, fallback);
      }
    });
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (index.fieldGlobal[name]) return;
      var match = contractFieldMatch(index, name);
      if (match && match.section) add(match, attribute);
    });
    pairResourceMaximums(result.resources, result.references);
    result.resources.sort(function (left, right) {
      return left.label.localeCompare(right.label) || left.name.localeCompare(right.name);
    });
    return result;
  }

  function contractFieldItemFingerprint(item) {
    return JSON.stringify([
      item.name, item._structure || '', item.kind || '', trim(item.onValue),
      item.writable !== false, item.automationVisible === true,
    ]);
  }

  function commonContractFieldItems(characterId, inspection, objects, rolls, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractFieldItems(characterId, inspection, objects, rolls, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length)
      return { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    var results = candidates.map(function (candidate) {
      return contractFieldItems(
        characterId,
        candidate,
        objects,
        contractRolls(characterId, candidate, objects, false, readLive),
        readLive,
        true,
      );
    });
    function shared(property, dictionaryProperty) {
      var lists = results.map(function (result) {
        return dictionaryProperty
          ? Object.keys(result[property] || {}).map(function (name) { return result[property][name]; })
          : result[property] || [];
      });
      var indexes = lists.slice(1).map(function (items) {
        var found = dictionary();
        items.forEach(function (item) { found[contractFieldItemFingerprint(item)] = item; });
        return found;
      });
      return (lists[0] || []).filter(function (item) {
        var key = contractFieldItemFingerprint(item);
        return indexes.every(function (index) { return !!index[key]; });
      }).map(function (item) {
        var key = contractFieldItemFingerprint(item);
        var peers = [item].concat(indexes.map(function (index) { return index[key]; }));
        var merged = merge({}, item);
        ['aliases', 'sourceLabels'].forEach(function (property) {
          var seen = dictionary();
          merged[property] = [];
          peers.forEach(function (peer) {
            (peer[property] || []).forEach(function (value) {
              var normalized = normalize(value);
              if (!normalized || seen[normalized]) return;
              seen[normalized] = true;
              merged[property].push(value);
            });
          });
        });
        if (!own(item, 'max')) return merged;
        merged.max = peers.every(function (peer) {
          return peer.max === item.max;
        }) ? item.max : null;
        return merged;
      });
    }
    var value = {
      resources: shared('resources'),
      tracked: dictionary(),
      aliases: dictionary(),
      byAttribute: dictionary(),
      references: shared('references'),
    };
    pairResourceMaximums(value.resources, value.references);
    shared('tracked', true).forEach(function (item) { value.tracked[item.name] = item; });
    value.resources.forEach(function (item) {
      value.byAttribute[item.name] = item;
      item.aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!value.aliases[key]) value.aliases[key] = [];
        value.aliases[key].push(item);
      });
    });
    return value;
  }

  function invalidate(characterId) {
    if (characterId) {
      delete cache[characterId];
      delete attributeObjectCache[characterId];
    } else {
      cache = {};
      attributeObjectCache = {};
      contractMatchCache = {};
    }
  }

  function scan(characterId, force) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    if (!force && cache[characterId] && cache[characterId].characterName === trim(character.get('name')))
      return cache[characterId];
    var objects = attrObjects(characterId);
    attributeObjectCache[characterId] = objects;
    var contractMatch = contractMatchCache[characterId] || inspectContracts(characterId, objects);
    var value = {};
    value.warnings = [];
    value.ok = true;
    value.profileId = 'sheet';
    value.score = contractMatch.match && contractMatch.match.score || 0;
    value.matched = contractMatch.status === 'matched';
    value.characterId = characterId;
    value.characterName = trim(character.get('name'));
    value.contractMatch = contractMatch;
    value.attributeByName = dictionary();
    objects.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) value.attributeByName[name] = attribute;
    });
    var readLive = cachedAttrReader(characterId);
    value.contractAllRolls = commonContractRolls(characterId, value.contractMatch, true, objects, readLive);
    value.contractRolls = value.contractAllRolls.filter(function (instance) { return !instance.hidden; });
    var fields = commonContractFieldItems(characterId, value.contractMatch, objects, value.contractRolls, readLive);
    value.resources = fields.resources;
    value.trackedFields = fields.tracked;
    value.resourceAliases = fields.aliases;
    value.resourcesByAttribute = fields.byAttribute;
    value.fieldReferences = fields.references;
    cache[characterId] = value;
    return value;
  }

  function scannedContractRolls(characterId, includeHidden) {
    var data = scan(characterId);
    return (includeHidden ? data.contractAllRolls : data.contractRolls) || [];
  }

  function preferredContractRolls(data) {
    // 일반/보너스 짝을 먼저 고른 뒤 시트 후보 간 동등화를 해야 짝이 유실되지 않습니다.
    var instances = actionableContractRolls(data.characterId, data.contractMatch, false);
    var preferred = dictionary();
    collapseEquivalentContractCandidates(data.characterId, preferSingleInlineRollActions(
      uniqueContractCandidates(instances.map(function (instance) {
        return { instance: instance };
      })),
    )).forEach(function (candidate) {
      preferred[candidate.instance.contract.id + '|' + candidate.instance.key] = true;
    });
    return instances.filter(function (instance) {
      return preferred[instance.contract.id + '|' + instance.key];
    });
  }

  var DETECTED_ROLE_LABELS = {
    health: ['체력', 'hp', 'hitpoint', 'hitpoints'],
    sanity: ['이성', 'san', 'sanity'],
    magicPoints: ['마력', 'mp', 'magicpoint', 'magicpoints', 'mana'],
    startingSanity: ['시작이성', '초기이성', 'startingsanity', 'initialsanity'],
    majorWound: ['중상', 'majorwound'],
    dying: ['빈사', 'dying'],
    longInsanity: ['장기', '장기광기', '장기적광기', 'indefiniteinsanity', 'indefinsane'],
    temporaryInsanity: ['일시', '일시광기', '일시적광기', '단기광기', 'temporaryinsanity', 'tempinsane'],
    intelligence: ['지능', 'int', 'intelligence'],
    characteristic: [
      '근력', 'str', 'strength', '건강', 'con', 'constitution', '크기', 'siz', 'size',
      '민첩', '민첩성', 'dex', 'dexterity', '외모', 'app', 'appearance',
      '지능', 'int', 'intelligence', '정신', '정신력', 'pow', 'power', '교육', 'edu', 'education',
    ],
  };

  function detectedLabelKeys(labels) {
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(contractDisplayLabel(label));
      var stripped = key
        .replace(/^(?:현재|current)/i, '')
        .replace(/(?:현재|current|값|수치|점수|value|score|체크|check|굴림|roll|판정)$/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function matchesDetectedRole(labels, role) {
    var wanted = DETECTED_ROLE_LABELS[role] || [];
    return detectedLabelKeys(labels).some(function (key) { return wanted.indexOf(key) > -1; });
  }

  function uniqueDetectedItems(items, role) {
    function collect(useToggleAliases) {
      var seen = dictionary();
      return (items || []).filter(function (item) {
        var labels = item && item.kind === 'toggle' && item.fieldLabel && !useToggleAliases
          ? [item.fieldLabel] : item && item.sourceLabels;
        if (!item || item.automationVisible !== true || !matchesDetectedRole(labels, role) || seen[item.name]) return false;
        seen[item.name] = true;
        return true;
      });
    }
    var matches = collect(false);
    if (!matches.length && (items || []).some(function (item) { return item && item.kind === 'toggle'; }))
      matches = collect(true);
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function linkedStartingSanityField(item, sanityName, labels) {
    var starting = detectedLabelKeys(labels).some(function (key) {
      return /^(?:시작|초기|starting|initial|start)(?:값|수치|점수|value|score)?$/i.test(key);
    });
    var candidateKey = fieldPairNameKey(item && item.name)
      .replace(/^(?:starting|initial|start|시작|초기)/i, '')
      .replace(/(?:starting|initial|start|시작|초기)$/i, '');
    return starting && candidateKey && candidateKey === fieldPairNameKey(sanityName);
  }

  function detectedFieldRole(data, role, kind) {
    var items = kind === 'toggle'
      ? Object.keys(data.trackedFields || {}).map(function (name) { return data.trackedFields[name]; })
        .filter(function (item) { return item.kind === 'toggle'; })
      : (data.resources || []).filter(function (item) {
          return role === 'startingSanity' ||
            !maximumFieldLabel(item.sourceLabels) &&
            !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
        });
    var detected = uniqueDetectedItems(items, role);
    if (role !== 'startingSanity' || detected.matches.length) return detected;
    var sanity = uniqueDetectedItems((data.resources || []).filter(function (item) {
      return !maximumFieldLabel(item.sourceLabels) &&
        !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
    }), 'sanity');
    if (!sanity.item) return detected;
    var seen = dictionary();
    var matches = items.filter(function (item) {
      if (!item || item.automationVisible !== true || seen[item.name] ||
        !linkedStartingSanityField(item, sanity.item.name, item.sourceLabels)) return false;
      seen[item.name] = true;
      return true;
    });
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function detectedRollLabels(instance) {
    return [instance && instance.label, instance && instance.roll && instance.roll.label]
      .concat(instance && instance.roll && instance.roll.aliases || [])
      .concat((instance && instance.roll && instance.roll.staticLabels || []).map(function (entry) {
        return entry && entry.value;
      }));
  }

  function neutralSourceRoll(instance) {
    var roll = instance && instance.roll;
    if (!roll || (Array.isArray(instance.modes) && instance.modes.length)) return false;
    var diceFields = 0;
    String(roll.raw || '').replace(/\{\{\s*[^={}]+?\s*=\s*([^}]*)\}\}/g, function (token, value) {
      if (/\[\[[\s\S]*?\b\d*d\d+/i.test(value)) diceFields += 1;
      return token;
    });
    if (diceFields !== 1) return false;
    var template = instance.contract && instance.contract.resultTemplates &&
      instance.contract.resultTemplates[roll.template];
    var groups = dictionary();
    (template && Array.isArray(template.rules) ? template.rules : []).forEach(function (rule) {
      if (rule && own(rule, 'group')) groups[String(rule.group)] = true;
    });
    return Object.keys(groups).length <= 1;
  }

  function detectedRollRole(data, role) {
    var seen = dictionary();
    var rolls = preferredContractRolls(data);
    var matches = rolls.filter(function (instance) {
      var key = instance && instance.key;
      if (!key || seen[key] || !matchesDetectedRole(detectedRollLabels(instance), role)) return false;
      seen[key] = true;
      return true;
    });
    if (!matches.length) {
      var field = detectedFieldRole(data, role, 'resource');
      var namedFields = (data.resources || []).filter(function (item) {
        return item.automationVisible === true && matchesDetectedRole([item.name], role);
      });
      var name = field.item && field.item.name || (namedFields.length === 1 && namedFields[0].name);
      seen = dictionary();
      if (name) matches = rolls.filter(function (instance) {
        var key = instance && instance.key;
        var references = false;
        String(instance && instance.roll && instance.roll.raw || '').replace(
          /@\{([^{}|]+)(?:\|max)?\}/g,
          function (token, sourceName) {
            if (contractRowAttr(instance.contract, instance.roll, instance.row, trim(sourceName)) === name)
              references = true;
            return token;
          },
        );
        if (!key || seen[key] || !references) return false;
        seen[key] = true;
        return true;
      });
    }
    matches = preferSingleInlineRollActions(matches.map(function (instance) {
      return { instance: instance };
    })).map(function (candidate) { return candidate.instance; });
    if (matches.length > 1) {
      var neutral = matches.filter(neutralSourceRoll);
      if (neutral.length === 1) matches = neutral;
    }
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

 function canControl(character, playerId) {
    if (!character) return false;
    if (playerId === 'API' || playerIsGM(playerId)) return true;
    var controlled = trim(character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
  }

  function hasPlayerController(character) {
    return trim(character && character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean)
      .some(function(id){return id==='all'||getObj('player',id)&&!playerIsGM(id);});
  }

  function profileCharacters() {
    return characterObjects().filter(function (character) {
      return usableContractInspection(inspectContracts(character.id));
    });
  }

  function resolveCharacterName(query, characters) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '캐릭터 이름을 입력해 주세요.' };
    characters = characters || profileCharacters();
    var exact = characters.filter(function (character) {
      return normalize(character.get('name')) === wanted;
    });
    if (exact.length === 1) return { ok: true, character: exact[0] };
    var partial = characters.filter(function (character) {
      return normalize(character.get('name')).indexOf(wanted) > -1;
    });
    if (partial.length === 1) return { ok: true, character: partial[0] };
    if (partial.length > 1)
      return {
        ok: false,
        error: '이름이 비슷한 캐릭터가 여러 명입니다: ' + partial.map(function (character) {
          return trim(character.get('name'));
        }).join(', '),
      };
    return { ok: false, error: '이름에 ' + trim(query) + '이(가) 들어간 캐릭터를 찾지 못했습니다.' };
  }

  function resolveCharacter(msg, explicitId) {
    if (!explicitId && msg && own(msg, '_kibSheetResolvedCharacter'))
      return msg._kibSheetResolvedCharacter;
    var resolved = resolveCharacterNow(msg, explicitId);
    if (!explicitId && msg) msg._kibSheetResolvedCharacter = resolved;
    return resolved;
  }

  function speakingCharacter(msg) {
    var player = getObj('player', msg && msg.playerid);
    var match = trim(player && player.get('speakingas')).match(/^character\|(.+)$/i);
    if (!match)
      return { ok: false, error: '채팅 입력창의 As를 사용할 캐릭터로 바꾼 뒤 다시 입력해 주세요.' };
    var character = getObj('character', match[1]);
    if (!character) return { ok: false, error: '현재 As 캐릭터를 찾지 못했습니다.' };
    return canControl(character, msg.playerid)
      ? { ok: true, character: character }
      : { ok: false, error: '현재 As 캐릭터를 조작할 권한이 없습니다.' };
  }

  function resolveCharacterNow(msg, explicitId) {
    if (explicitId) {
      var direct = getObj('character', explicitId);
      if (!direct) return { ok: false, error: '버튼에 기록된 캐릭터를 찾지 못했습니다.' };
      if (!canControl(direct, msg.playerid))
        return { ok: false, error: '이 캐릭터를 조작할 권한이 없습니다.' };
    }
    var speaking = speakingCharacter(msg);
    if (!speaking.ok) return speaking;
    if (explicitId && speaking.character.id !== explicitId)
      return { ok: false, error: '현재 As 캐릭터와 버튼에 기록된 캐릭터가 다릅니다. 현재 As의 현황을 다시 열어 주세요.' };
    return speaking;
  }

  function resolveInspectionCharacter(msg) {
    if (playerIsGM(msg.playerid)) {
      var managed = getObj('character', initState().managerCharacterId);
      if (managed) return { ok: true, character: managed };
    }
    return resolveCharacter(msg, '');
  }

  function ensureSheet(character) {
    var contractMatch = inspectContracts(character.id);
    if (!usableContractInspection(contractMatch))
      return {
        ok: false,
        error: contractMatch.error || SHEET_NOT_RECOGNIZED,
      };
    return { ok: true, data: scan(character.id) };
  }

  var OUTCOMES = {
    roll: '판정 실행',
    critical: '대성공',
    extreme: '극단적 성공',
    hard: '어려운 성공',
    success: '보통 성공',
    failure: '실패',
    fumble: '대실패',
  };

  function resultKey(system, label) {
    return normalize(system) + ':' + encodeURIComponent(normalize(label));
  }

  function contractCutinKey(instance) {
    return resultKey('sheet', instance.key);
  }

  function templateValue(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = content.match(new RegExp('\\{\\{\\s*' + escaped + '\\s*=\\s*([^}]*)\\}\\}', 'i'));
    if (!match) return null;
    var value = trim(match[1]);
    if (!value) return null;
    var inline = value.match(/^\$\[\[(\d+)\]\]$/);
    if (inline) {
      var roll = message.inlinerolls && message.inlinerolls[Number(inline[1])];
      var total = roll && roll.results && Number(roll.results.total);
      return isFinite(total) ? total : null;
    }
    var number = Number(value.replace(/^\[\[|\]\]$/g, ''));
    return isFinite(number) ? number : null;
  }

  function templateHasField(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\{\\{\\s*' + escaped + '\\s*=', 'i').test(content);
  }

  function contractResultMode(message, payload) {
    var mode = 'normal';
    var modeLabel = normalize(payload && payload.modeLabel);
    if (/(?:보너스|bonus).*2/.test(modeLabel)) mode = 'bonus2';
    else if (/(?:보너스|bonus).*1/.test(modeLabel)) mode = 'bonus1';
    else if (/(?:패널티|페널티|penalty).*2/.test(modeLabel)) mode = 'penalty2';
    else if (/(?:패널티|페널티|penalty).*1/.test(modeLabel)) mode = 'penalty1';
    var diceType = templateValue(message, 'dice_type');
    if (mode === 'normal') {
      if (diceType === 1) mode = 'bonus1';
      else if (diceType === 2) mode = 'bonus2';
      else if (diceType === -1) mode = 'penalty1';
      else if (diceType === -2) mode = 'penalty2';
    }
    return mode;
  }

  function sourceResultTemplateForContract(contract, key) {
    if (!contract || !contract.resultTemplates) return null;
    var roll = contractRuntimeIndex(contract).rollsByKey[String(key)];
    if (!roll || !roll.template) return null;
    if (contract.resultTemplates[roll.template]) return contract.resultTemplates[roll.template];
    var wanted = normalize(roll.template);
    var names = Object.keys(contract.resultTemplates);
    for (var index = 0; index < names.length; index += 1) {
      if (normalize(names[index]) === wanted) return contract.resultTemplates[names[index]];
    }
    return null;
  }

  function sourceResultTemplate(payload) {
    if (!payload || !payload.contractId || !payload.key) return null;
    var contracts = sheetContracts();
    for (var i = 0; i < contracts.length; i += 1) {
      var contract = contracts[i];
      if (String(contract.id) === String(payload.contractId))
        return sourceResultTemplateForContract(contract, payload.key);
    }
    return null;
  }

  function sourceResultOperand(message, value) {
    var raw = trim(value);
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(raw)) return Number(raw);
    return templateValue(message, raw);
  }

  function sourceResultCondition(message, condition) {
    if (!condition || !Array.isArray(condition.args) || !condition.args.length) return false;
    var matched = false;
    if (condition.op === 'present') matched = templateHasField(message, condition.args[0]);
    else {
      var left = sourceResultOperand(message, condition.args[0]);
      if (left === null) matched = false;
      else if (condition.op === 'eq') {
        var right = sourceResultOperand(message, condition.args[1]);
        matched = right !== null && left === right;
      } else if (condition.op === 'gt') {
        var greater = sourceResultOperand(message, condition.args[1]);
        matched = greater !== null && left > greater;
      } else if (condition.op === 'lt') {
        var less = sourceResultOperand(message, condition.args[1]);
        matched = less !== null && left < less;
      } else if (condition.op === 'between') {
        var lower = sourceResultOperand(message, condition.args[1]);
        var upper = sourceResultOperand(message, condition.args[2]);
        matched = lower !== null && upper !== null && left >= lower && left <= upper;
      }
    }
    return condition.not ? !matched : matched;
  }

  function sourceResultGroupMatches(group, mode) {
    var expected = mode === 'bonus2' ? '+2'
      : mode === 'bonus1' ? '+1'
        : mode === 'penalty2' ? '-2'
          : mode === 'penalty1' ? '-1'
            : '0';
    return String(group) === expected;
  }

  function sourceContractResult(message, payload, mode) {
    var template = sourceResultTemplate(payload);
    var rules = template && Array.isArray(template.rules) ? template.rules : [];
    if (!rules.length) return null;
    var grouped = rules.some(function (rule) { return own(rule, 'group'); });
    for (var i = 0; i < rules.length; i += 1) {
      var rule = rules[i];
      if (!rule || !OUTCOMES[rule.outcome] || !Array.isArray(rule.conditions)) continue;
      if (grouped && (!own(rule, 'group') || !sourceResultGroupMatches(rule.group, mode))) continue;
      if (!rule.conditions.every(function (condition) { return sourceResultCondition(message, condition); })) continue;
      var total = templateValue(message, rule.valueField);
      if (total === null) continue;
      return { total: total, outcome: rule.outcome, outcomeLabel: OUTCOMES[rule.outcome] };
    }
    return null;
  }

 function contractResult(message, payload) {
    var target = templateValue(message, 'success');
    var hard = templateValue(message, 'hard');
    var extreme = templateValue(message, 'extreme');
    var critical = templateValue(message, 'critical');
    var fumble = templateValue(message, 'fumble');
    var mode = contractResultMode(message, payload);
    var sourceOutcome = sourceContractResult(message, payload, mode);
    if (sourceOutcome) {
      sourceOutcome.target = target;
      sourceOutcome.hard = hard;
      sourceOutcome.extreme = extreme;
      sourceOutcome.mode = mode;
      return sourceOutcome;
    }
    var roll1 = templateValue(message, 'roll1');
    var roll2 = templateValue(message, 'roll2');
    var roll3 = templateValue(message, 'roll3');
    var rolled = templateValue(message, 'roll');
    if (mode === 'normal' && rolled === null) rolled = roll1;
    if (mode === 'bonus1') rolled = roll1 !== null && roll2 !== null ? Math.min(roll1, roll2) : null;
    else if (mode === 'bonus2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.min(roll1, roll2, roll3) : null;
    else if (mode === 'penalty1') rolled = roll1 !== null && roll2 !== null ? Math.max(roll1, roll2) : null;
    else if (mode === 'penalty2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.max(roll1, roll2, roll3) : null;
    if (target === null) {
      var genericTotal = rolled;
      if (genericTotal === null && message && Array.isArray(message.inlinerolls) && message.inlinerolls.length) {
        var firstTotal = message.inlinerolls[0] && message.inlinerolls[0].results && Number(message.inlinerolls[0].results.total);
        genericTotal = isFinite(firstTotal) ? firstTotal : null;
      }
      return genericTotal === null ? null : { total: genericTotal, outcome: 'roll', outcomeLabel: OUTCOMES.roll };
    }
    if (rolled === null) return null;
    var outcome = 'failure';
    if (critical !== null && rolled <= critical) outcome = 'critical';
    else if (fumble !== null && rolled >= fumble) outcome = 'fumble';
    else if (extreme !== null && rolled <= extreme) outcome = 'extreme';
    else if (hard !== null && rolled <= hard) outcome = 'hard';
    else if (rolled <= target) outcome = 'success';
    return {
      total: rolled,
      target: target,
      hard: hard,
      extreme: extreme,
      mode: mode,
      outcome: outcome,
      outcomeLabel: OUTCOMES[outcome],
    };
  }

  function emitResult(payload, message) {
    var result = payload.contractId ? contractResult(message, payload) : null;
    if (result) {
      payload.result = result;
      payload.outcome = result.outcome;
      payload.outcomeLabel = result.outcomeLabel;
    }
    var automaticInsanity = payload._automaticInsanity;
    delete payload._automaticInsanity;
    if (automaticInsanity) finishAutomaticInsanity(payload, result, automaticInsanity);
    payload.message = message || null;
    if (typeof KIBScene.broadcast === 'function')
      KIBScene.broadcast('sheet:result', payload);
    else {
      var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
      var listener = cutin && cutin.events && cutin.events['sheet:result'];
      if (typeof listener === 'function') listener(payload);
    }
  }

  function prunePendingResults() {
    var cutoff = Date.now() - 30000;
    Object.keys(pendingResults).forEach(function (token) {
      if (pendingResults[token].created < cutoff) delete pendingResults[token];
    });
  }

  function messageTemplateFields(message) {
    var fields = dictionary();
    String(message && message.content || '').replace(/\{\{\s*([^={}]+?)\s*=\s*([^}]*)\}\}/g, function (token, name, value) {
      fields[trim(name).toLowerCase()] = trim(value);
      return token;
    });
    return fields;
  }

  function sourceTemplateFieldNames(raw) {
    var found = dictionary();
    String(raw || '').replace(/\{\{\s*([^={}]+?)\s*=/g, function (token, name) {
      found[trim(name).toLowerCase()] = true;
      return token;
    });
    return Object.keys(found);
  }

  function normalizedTemplateText(value) {
    return normalize(String(value == null ? '' : value).replace(/<[^>]*>/g, ' '));
  }

  function directResultCharacters(message, fields) {
    var speaking = speakingCharacter(message);
    return speaking.ok ? [speaking.character] : [];
  }

  function directInstanceScore(characterId, instance, fields) {
    var roll = instance.roll || {};
    var score = 0;
    var rejected = false;
    var hasIdentity = false;
    var matchedIdentity = false;
    (Array.isArray(roll.staticLabels) ? roll.staticLabels : []).forEach(function (entry) {
      if (rejected || !entry || typeof entry !== 'object' || !entry.field) return;
      hasIdentity = true;
      var field = trim(entry.field).toLowerCase();
      if (!own(fields, field)) return;
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(entry.value)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
      if (rejected || !ref || !ref.field) return;
      hasIdentity = true;
      var field = trim(ref.field).toLowerCase();
      if (!own(fields, field)) return;
      var expected = contractLabelRef(characterId, instance.contract, roll, instance.row, ref);
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(expected)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    if (rejected || (hasIdentity && !matchedIdentity)) return -1;
    sourceTemplateFieldNames(roll.raw).forEach(function (field) {
      if (own(fields, field)) score += 1;
    });
    var values = dictionary();
    Object.keys(fields).forEach(function (field) {
      var value = normalizedTemplateText(fields[field]);
      if (value) values[value] = true;
    });
    (instance.aliases || []).forEach(function (alias) {
      if (values[normalize(alias)]) score += 3;
    });
    return score;
  }

  function directInstanceIdentity(instance) {
    var roll = instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(roll.name),
      normalize(roll.template),
      normalize(instance.label),
      repeating && repeating.section || '',
      instance.row && instance.row.id || '',
      roll.staticLabels || [],
      roll.labelRefs || [],
    ]);
  }

  function captureDirectResult(message) {
    if (!message || !message.rolltemplate || !Array.isArray(message.inlinerolls)) return false;
    var fields = messageTemplateFields(message);
    var matches = [];
    directResultCharacters(message, fields).forEach(function (character) {
      var data = scan(character.id);
      if (!data.ok || !data.contractMatch) return;
      var instances = data.contractMatch.status === 'matched'
        ? data.contractRolls
        : actionableContractRolls(character.id, data.contractMatch, false);
      var template = normalize(message.rolltemplate);
      instances.forEach(function (instance) {
        if (normalize(instance.roll && instance.roll.template) !== template) return;
        var score = directInstanceScore(character.id, instance, fields);
        if (score > 0) matches.push({ character: character, instance: instance, score: score });
      });
    });
    if (!matches.length) return false;
    var bestScore = Math.max.apply(Math, matches.map(function (match) { return match.score; }));
    var best = matches.filter(function (match) { return match.score === bestScore; });
    var keys = dictionary();
    best.forEach(function (match) { keys[contractCutinKey(match.instance)] = true; });
    if (Object.keys(keys).length !== 1) {
      var identities = dictionary();
      best.forEach(function (match) { identities[directInstanceIdentity(match.instance)] = true; });
      if (Object.keys(identities).length !== 1) return false;
    }
    var match = best[0];
    emitResult({
      source: 'sheet',
      system: 'sheet',
      kind: match.instance.roll.kind || 'contract',
      characterId: match.character.id,
      contractId: match.instance.contract.id,
      sourceHash: match.instance.contract.sourceHash || '',
      key: match.instance.roll.key,
      label: match.instance.label,
      aliases: match.instance.aliases || [],
      cutinKey: contractCutinKey(match.instance),
      mode: '',
      modeLabel: '',
      secret: message.type === 'whisper' || message.type === 'gmrollresult',
    }, message);
    return true;
  }

  function captureResult(message) {
    var content = String((message && message.content) || '');
    var tokenMatch = content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch && pendingResults[tokenMatch[1]]) {
      var pending = pendingResults[tokenMatch[1]];
      delete pendingResults[tokenMatch[1]];
      emitResult(pending.payload, message);
      return true;
    }
    return captureDirectResult(message);
  }

  function merge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }

  function sendSheet(character, content, payload) {
    prunePendingResults();
    var token = 'k' + Date.now().toString(36) + randomInteger(1000000000).toString(36);
    pendingResults[token] = { created: Date.now(), payload: payload };
    try {
      sendChat('character|' + character.id, content + ' {{kib_sheet_result=' + token + '}}');
      return { ok: true, payload: payload };
    } catch (err) {
      delete pendingResults[token];
      return { ok: false, error: '판정 메시지를 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function sourceContractAction(character, query, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    var resolved = resolveContractAction(character, query, secret);
    return resolved.handled
      ? resolved.result
      : { ok: false, error: '현재 시트에서 ' + trim(query) + ' 굴림을 찾지 못했습니다.' };
  }

  function sourceContractNeedsName(character) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    return { ok: false, error: '시트에서 읽은 굴림은 <code>!!굴릴항목이름</code>으로 실행해 주세요.' };
  }

  function rollCheck(characterId, query, options) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, trim(query) + (options && trim(options.mode) ? ' ' + trim(options.mode) : ''), !!(options && options.secret));
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function safeRollExpression(expression) {
    var source = trim(expression);
    if (!source || source.length > 100) return null;
    var scrubbed = source.replace(/@\{[A-Za-z0-9_$-]+(?:\|max)?\}/g, '1');
    if (scrubbed.indexOf('@{') > -1) return null;
    var withoutFunctions = scrubbed.replace(/\b(?:floor|ceil|round|min|max|abs)\b/gi, '');
    if (!/^[\d\s+dD*/().,-]+$/.test(withoutFunctions)) return null;
    var dice = scrubbed.match(/(?:\d*)d\d+/gi) || [];
    for (var i = 0; i < dice.length; i++) {
      var match = dice[i].match(/^(\d*)d(\d+)$/i);
      var count = Number(match[1] || 1);
      var sides = Number(match[2]);
      if (count < 1 || count > 100 || sides < 1 || sides > 100000) return null;
    }
    return source;
  }

  function safeUserRollExpression(characterId, expression) {
    var resolved = resolvedRollExpression(characterId, expression, [], 0, {});
    if (!resolved) return null;
    if (!/(^|[^A-Za-z0-9_])(?:\d*)d\d+([^A-Za-z0-9_]|$)/i.test(resolved)) return null;
    var source = resolved.replace(/\s+/g, '');
    var tokens = [];
    while (source) {
      var match = source.match(/^(floor|ceil|round|min|max|abs|\d*d\d+|\d+(?:\.\d+)?|[()+\-*\/,])/i);
      if (!match) return null;
      tokens.push(match[1]);
      source = source.substring(match[1].length);
    }
    var depth = 0;
    var expectingValue = true;
    var unary = false;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token)) {
        if (!expectingValue || tokens[i + 1] !== '(') return null;
        continue;
      }
      if (token === '(') {
        if (!expectingValue) return null;
        depth++;
        unary = false;
        continue;
      }
      if (token === ')') {
        if (expectingValue || depth < 1) return null;
        depth--;
        expectingValue = false;
        unary = false;
        continue;
      }
      if (token === ',') {
        if (expectingValue || depth < 1) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (/^[+\-]$/.test(token) && expectingValue) {
        if (unary) return null;
        unary = true;
        continue;
      }
      if (/^[+\-*\/]$/.test(token)) {
        if (expectingValue) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (!expectingValue) return null;
      expectingValue = false;
      unary = false;
    }
    return !expectingValue && depth === 0 ? resolved : null;
  }

  function repeatingScope(name) {
    var match = trim(name).match(/^(repeating_.+_(?:\$\d+|-[A-Za-z0-9_-]+)_)/);
    return match ? [match[1]] : [];
  }

  function expressionAttribute(characterId, name, valueType, scopes, defaults, rowContext) {
    var candidates = [];
    var rowLocal = rowContext && rowContext.fields && own(rowContext.fields, name);
    if (name.indexOf('repeating_') !== 0) {
      (scopes || []).forEach(function (scope) {
        candidates.push({ name: scope + name, scopes: scopes });
      });
    }
    if (!rowLocal) candidates.push({ name: name, scopes: repeatingScope(name) });
    for (var i = 0; i < candidates.length; i++) {
      var valueKey = candidates[i].name + '|' + valueType;
      var resolved = !rowLocal && rowContext && typeof rowContext.resolveAttribute === 'function'
        ? rowContext.resolveAttribute(candidates[i].name, valueType) : undefined;
      var value = rowLocal && rowContext.values && own(rowContext.values, valueKey)
        ? rowContext.values[valueKey]
        : rowLocal ? undefined : resolved !== undefined ? resolved
          : getAttr(characterId, candidates[i].name, valueType);
      if ((value === undefined || trim(value) === '') && defaults && own(defaults, candidates[i].name))
        value = defaults[candidates[i].name];
      if (value !== undefined && trim(value) !== '')
        return { name: candidates[i].name, value: value, scopes: candidates[i].scopes };
    }
    return null;
  }

  function resolvedRollExpression(characterId, expression, scopes, depth, trail, defaults, rowContext) {
    if ((depth || 0) > 8) return null;
    var source = trim(expression);
    if (!source) return null;
    var failed = false;
    source = source.replace(/@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g, function (match, name, valueType) {
      var found = expressionAttribute(characterId, name, valueType || 'current', scopes || [], defaults, rowContext);
      if (!found || (trail && trail[found.name])) {
        failed = true;
        return '0';
      }
      var nextTrail = dictionary();
      Object.keys(trail || {}).forEach(function (key) { nextTrail[key] = true; });
      nextTrail[found.name] = true;
      var nested = resolvedRollExpression(
        characterId,
        found.value,
        found.scopes,
        (depth || 0) + 1,
        nextTrail,
        defaults,
        rowContext,
      );
      if (!nested) {
        failed = true;
        return '0';
      }
      return '(' + nested + ')';
    });
    if (failed || source.indexOf('@{') > -1) return null;
    return safeRollExpression(source);
  }

  function rollWeapon(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function showSpell(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollArmor(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollFree(characterId, secret, expressionOverride) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = expressionOverride !== undefined
      ? executeContractExpression(character, expressionOverride, secret)
      : sourceContractNeedsName(character);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

 function contractChoice(instance, mode, secret, expression) {
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    return {
      kind: 'contract',
      characterId: instance.characterId,
      contractId: instance.contract.id,
      rollKey: instance.roll.key,
      rowId: instance.row ? instance.row.id : '',
      modeId: mode ? String(mode.id || '') : '',
      label: (instance.label || '시트 굴림') + (modeLabels.length ? ' / ' + modeLabels[0] : ''),
      secret: !!secret,
      expression: expression || '',
    };
  }

  function contractConflict(instances, secret, expression) {
    var entries = instances.slice(0, 50);
    var choices = entries.map(function (entry) {
      return contractChoice(entry.instance, entry.mode || null, secret, expression);
    });
    var counts = dictionary();
    choices.forEach(function (choice) {
      var key = normalize(choice.label);
      counts[key] = (counts[key] || 0) + 1;
    });
    var used = dictionary();
    choices.forEach(function (choice, index) {
      var key = normalize(choice.label);
      if (counts[key] < 2) return;
      used[key] = (used[key] || 0) + 1;
      choice.label += ' (선택 ' + used[key] + ')';
    });
    return {
      ok: false,
      reason: 'conflict',
      error: '시트 원본에서 맞는 실행 항목이 여러 개입니다.' + (instances.length > choices.length ? ' 먼저 50개만 표시합니다.' : ''),
      choices: choices,
    };
  }

  function replaceContractQueries(source, queries) {
    var value = source;
    var consumed = dictionary();
    (queries || []).filter(function (query) { return !!query.raw; }).sort(function (left, right) {
      return right.raw.length - left.raw.length || left.occurrence - right.occurrence;
    }).forEach(function (query) {
      var used = consumed[query.raw] || 0;
      var wanted = Math.max(1, query.occurrence - used);
      var start = 0;
      var found = -1;
      for (var index = 0; index < wanted; index++) {
        found = value.indexOf(query.raw, start);
        if (found < 0) break;
        start = found + query.raw.length;
      }
      if (found > -1) value = value.slice(0, found) + query.value + value.slice(found + query.raw.length);
      consumed[query.raw] = used + 1;
    });
    var grouped = dictionary();
    (queries || []).filter(function (query) { return !query.raw && query.name; }).forEach(function (query) {
      var key = normalize(query.name);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(query);
    });
    var seen = dictionary();
    return value.replace(/\?\{([^{}]*)\}/g, function (match, content) {
      var key = normalize(trim(content.split('|')[0]));
      seen[key] = (seen[key] || 0) + 1;
      var selected = (grouped[key] || []).filter(function (query) {
        return query.occurrence === seen[key];
      })[0];
      return selected ? selected.value : match;
    });
  }

  function qualifyContractMacro(characterId, instance, mode, expression) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    if (!raw || raw.length > 20000) return { ok: false, error: '시트의 굴림 값이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(raw)) return { ok: false, error: 'API 명령을 실행하는 시트 굴림은 대신 실행하지 않습니다.' };
    if (/\{\{\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (/%\{\s*(?:selected|target)\|/i.test(raw))
      return { ok: false, error: 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.' };
    if (mode && !contractOverridesValid(instance.contract, instance.roll, mode))
      return { ok: false, error: '현재 시트의 선택 방식이 굴림에 맞지 않습니다.' };
    var overrides = contractOverrides(mode);
    var expressionRefs = Array.isArray(instance.roll.expressionRefs) ? instance.roll.expressionRefs : [];
    if (expression !== undefined) {
      expressionRefs.forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) overrides[name] = expression;
      });
    }
    raw = replaceContractQueries(raw, contractQueries(mode));
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = null;
    var failed = '';
    var expansions = 0;
    function savedAttribute(name) {
      if (!savedAttributes) {
        savedAttributes = dictionary();
        (attributeObjectCache[characterId] || attrObjects(characterId)).forEach(function (attribute) {
          savedAttributes[trim(attribute.get('name'))] = attribute;
        });
      }
      return savedAttributes[name] || null;
    }
    function sourceValue(name, maximum) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var value = field && field[maximum ? 'max' : 'default'];
      if ((value === undefined || value === null || trim(value) === '') && !maximum) {
        var control = sourceControls[name] || runtimeIndex.controls[name];
        value = control && control.default;
      }
      if ((value === undefined || value === null || trim(value) === '') && !maximum && field && field.type === 'checkbox')
        value = '0';
      return value === undefined || value === null || trim(value) === '' ? null : String(value);
    }
    function missingValueError(name) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var label = field && userFacingField(field) ? fieldLabel(field, '') : '';
      var rollLabel = contractDisplayLabel(instance.label) || '선택한';
      return label && normalize(label) !== normalize(rollLabel)
        ? rollLabel + ' 굴림에 필요한 ' + label + ' 값이 비어 있습니다.'
        : rollLabel + ' 굴림에 필요한 수치가 비어 있습니다.';
    }
    function expand(fragment, depth, trail, required) {
      if (failed) return '';
      if (depth > 12) {
        failed = '시트 항목 연결이 너무 깊습니다.';
        return '';
      }
      var source = String(fragment);
      if (source.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      var expanded = source.replace(/@\{([^{}]+)\}/g, function (match, body, offset) {
        if (failed) return '';
        if (++expansions > 512) {
          failed = '시트 항목 연결이 너무 복잡합니다.';
          return '';
        }
        var parts = body.split('|').map(trim);
        var keyword = normalize(parts[0]);
        if (keyword === 'selected' || keyword === 'target') {
          failed = 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.';
          return '';
        }
        var local = parts.length === 1 || (parts.length === 2 && normalize(parts[1]) === 'max');
        if (!local) {
          failed = '현재 캐릭터 외 속성을 참조하는 롤은 실행하지 않습니다.';
          return '';
        }
        var name = parts[0];
        var maximum = parts.length === 2;
        var requiredHere = required || source.lastIndexOf('[[', offset) > source.lastIndexOf(']]', offset);
        if (!maximum && own(overrides, name)) {
          if (requiredHere && trim(overrides[name]) === '') {
            failed = missingValueError(name);
            return '';
          }
          if (trail[name]) {
            failed = '시트 항목 연결이 순환합니다: ' + name;
            return '';
          }
          var nextTrail = dictionary();
          Object.keys(trail).forEach(function (key) { nextTrail[key] = true; });
          nextTrail[name] = true;
          return expand(overrides[name], depth + 1, nextTrail, requiredHere);
        }
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var stored = savedAttribute(fullName);
        var sourceField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        var visibleDefault = !stored && sourceField && sourceField.numericCandidate &&
          !sourceField.hidden && !sourceField.readonly && !sourceField.disabled
          ? sourceValue(name, maximum) : null;
        var live = stored ? null : getAttr(characterId, fullName, maximum ? 'max' : 'current');
        var actual = stored ? stored.get(maximum ? 'max' : 'current')
          : visibleDefault !== null && !maximum
            ? contractUnsavedFieldValue(sourceField, live, visibleDefault, false)
            : live;
        if (actual !== undefined && actual !== null && trim(actual) !== '' && /@\{[^{}]+\}/.test(String(actual))) {
          var attrKey = 'attr|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[attrKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var attrTrail = dictionary();
          Object.keys(trail).forEach(function (key) { attrTrail[key] = true; });
          attrTrail[attrKey] = true;
          return expand(actual, depth + 1, attrTrail, requiredHere);
        }
        if (actual !== undefined && actual !== null && trim(actual) !== '') return String(actual);
        if (stored) {
          var savedField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
          if (savedField && savedField.type === 'checkbox') return '0';
          if (!savedField || !savedField.hidden) {
            if (requiredHere) failed = missingValueError(name);
            return '';
          }
        }
        var fallback = sourceValue(name, maximum);
        if (fallback !== null) {
          var fallbackKey = 'default|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[fallbackKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var fallbackTrail = dictionary();
          Object.keys(trail).forEach(function (key) { fallbackTrail[key] = true; });
          fallbackTrail[fallbackKey] = true;
          return expand(fallback, depth + 1, fallbackTrail, requiredHere);
        }
        if (requiredHere) failed = missingValueError(name);
        return '';
      });
      if (expanded.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      return expanded;
    }
    var content = expand(raw, 0, {}, false);
    if (failed) return { ok: false, error: failed };
    if (!content || content.length > 20000) return { ok: false, error: '확장된 시트 롤이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(content) || /%\{[^{}]+\}/.test(content))
      return { ok: false, error: '다른 능력 또는 API 명령을 불러오는 롤은 안전하게 재생할 수 없습니다.' };
    if (/\{\{\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (content.indexOf('?{') > -1)
      return { ok: false, reason: 'query', error: '이 굴림은 시트에서 고르는 값이 더 필요합니다.' };
    return { ok: true, content: content };
  }

  function currentContractModes(characterId, instance) {
    var index = contractRuntimeIndex(instance.contract);
    var controls = index.rollControls[instance.roll.key] || index.controls;
    return (instance.modes || []).filter(function (mode) {
      var overrides = contractOverrides(mode);
      return Object.keys(overrides).every(function (name) {
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var current = getAttr(characterId, fullName);
        var control = controls[name];
        if ((current === undefined || current === null || String(current) === '') && control && own(control, 'default'))
          current = control.default;
        return current === undefined || current === null || String(current) === String(overrides[name]);
      });
    });
  }

  function executeContractInstance(character, instance, modeId, secret, expression, modeLabelOverride) {
    instance.characterId = character.id;
    var modes = instance.modes || [];
    var mode = null;
    if (modeId) {
      var matchingModes = modes.filter(function (candidate) { return String(candidate.id || '') === String(modeId); });
      if (matchingModes.length !== 1)
        return { ok: false, error: '선택한 굴림 방식이 바뀌었습니다. 항목을 다시 선택해 주세요.' };
      mode = matchingModes[0];
    }
    var qualified = qualifyContractMacro(character.id, instance, mode, expression);
    if (!qualified.ok) {
      if (qualified.reason === 'query' && !mode && modes.length) {
        var choices = currentContractModes(character.id, instance).filter(function (candidate) {
          return contractQueries(candidate).length > 0;
        });
        if (choices.length === 1)
          return executeContractInstance(character, instance, choices[0].id, secret, expression, modeLabelOverride);
        if (choices.length > 1)
          return contractConflict(choices.map(function (candidate) { return { instance: instance, mode: candidate }; }), secret, expression);
        return { ok: false, error: '현재 시트에서 같은 굴림 방식을 찾지 못했습니다.' };
      }
      return qualified;
    }
    var label = instance.label;
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    var content = qualified.content;
    var system = 'sheet';
    if (secret && !/^\s*\/(?:w|gmroll)\b/i.test(content)) content = '/w gm ' + content;
    var payload = {
      source: 'helper',
      system: system,
      kind: instance.roll.kind || 'contract',
      characterId: character.id,
      contractId: instance.contract.id,
      sourceHash: instance.contract.sourceHash || '',
      key: instance.roll.key,
      label: label,
      aliases: instance.aliases || [],
      cutinKey: contractCutinKey(instance),
      mode: mode ? String(mode.id || '') : normalize(modeLabelOverride),
      modeLabel: trim(modeLabelOverride) || modeLabels[0] || '',
      secret: !!secret,
    };
    if (/&\{\s*template\s*:/i.test(content)) return sendSheet(character, content, payload);
    try {
      sendChat('character|' + character.id, content);
      payload.resultTracking = false;
      return { ok: true, payload: payload };
    } catch (err) {
      return { ok: false, error: '시트 롤을 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function exactContractInstance(characterId, contractId, rollKey, rowId, includeHidden) {
    var inspection = inspectContracts(characterId);
    if (inspection.status !== 'matched' &&
        !(inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'))
      return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
    var allowed = inspection.status === 'matched'
      ? [inspection.contract.id]
      : (inspection.matches || []).map(function (match) { return match.id; });
    if (allowed.indexOf(String(contractId)) < 0)
      return { ok: false, error: '선택한 굴림 정보가 현재 캐릭터와 더 이상 맞지 않습니다.' };
    var matches = actionableContractRolls(characterId, inspection, !!includeHidden).filter(function (instance) {
      return String(instance.contract.id) === String(contractId) &&
        String(instance.roll.key) === String(rollKey) && String(instance.row ? instance.row.id : '') === String(rowId || '');
    });
    return matches.length === 1
      ? { ok: true, instance: matches[0] }
      : { ok: false, error: '선택한 굴림 또는 반복행이 바뀌었습니다.' };
  }

  function contractExpressionRef(characterId, instance) {
    var refs = instance && instance.roll && Array.isArray(instance.roll.expressionRefs)
      ? instance.roll.expressionRefs : [];
    if (refs.length !== 1) return '';
    var name = contractRefName(refs[0]);
    var control = contractControls(instance.contract, instance.roll).filter(function (candidate) {
      return contractControlName(candidate) === name;
    })[0];
    var type = trim(control && control.type).toLowerCase();
    if (!name || (type !== 'text' && type !== 'textarea')) return '';
    var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
    var value = getAttr(characterId, fullName);
    if ((value === undefined || value === null || String(value) === '') && control && own(control, 'default'))
      value = control.default;
    value = trim(value);
    if (value && !safeUserRollExpression(characterId, value)) return '';
    return name;
  }

  function executeContract(characterId, contractId, rollKey, rowId, modeId, secret, expressionText) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var exact = exactContractInstance(characterId, contractId, rollKey, rowId, !!modeId);
    if (!exact.ok) return exact;
    var expression;
    if (expressionText !== undefined && expressionText !== '') {
      if (!contractExpressionRef(characterId, exact.instance))
        return { ok: false, error: '선택한 굴림은 자유 주사위 식을 받지 않습니다.' };
      expression = safeUserRollExpression(characterId, expressionText);
      if (!expression) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    }
    return executeContractInstance(character, exact.instance, modeId, secret, expression);
  }

  function contractInstanceAliases(instance, compatible, primaryOnly) {
    var found = dictionary();
    var result = [];
    var labels = primaryOnly ? [instance.label,
      trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, '')] : instance.aliases || [];
    labels.forEach(function (value) {
      contractLookupKeys(value, compatible).forEach(function (key) {
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    });
    return result;
  }

  function contractLookupKeys(value, compatible) {
    var key = normalize(value);
    if (!key) return [];
    if (compatible === false) return [key];
    var canonical = key.replace(/페널티/g, '패널티')
      .replace(/(?:주사위|dice)/g, '')
      .replace(/(\d)개/g, '$1')
      .replace(/개(?=\d)/g, '');
    return canonical === key || !canonical ? [key] : [key, canonical];
  }

  function contractModeCandidates(instance, compatible, primaryOnly) {
    var actionAliases = contractInstanceAliases(instance, compatible, primaryOnly);
    var result = [];
    (instance.modes || []).forEach(function (mode) {
      var modeAliases = [];
      contractUserModeLabels(mode).forEach(function (label) {
        modeAliases = modeAliases.concat(contractLookupKeys(label, compatible));
      });
      var combined = [];
      actionAliases.forEach(function (action) {
        modeAliases.forEach(function (modeAlias) { combined.push(action + modeAlias); });
      });
      result.push({ instance: instance, mode: mode, modeValues: modeAliases,
        exactValues: modeAliases.concat(combined), partialValues: combined });
    });
    return result;
  }

  function contractKeysMatch(values, wanted, partial) {
    return values.some(function (value) {
      return wanted.some(function (key) {
        return partial ? value.indexOf(key) > -1 : value === key;
      });
    });
  }

  function contractMatchRank(values, wanted) {
    var best = 3;
    values.forEach(function (value) {
      wanted.forEach(function (key) {
        if (value === key) best = 0;
        else if (best > 1 && value.indexOf(key) === 0) best = 1;
        else if (best > 2 && value.indexOf(key) > -1) best = 2;
      });
    });
    return best;
  }

  function closestContractActions(instances, query, includeHidden) {
    var wanted = contractLookupKeys(query, true);
    var best = 12;
    var found = [];
    instances.forEach(function (instance) {
      if (instance.hidden && !includeHidden) return;
      var rank = contractMatchRank(contractInstanceAliases(instance, true), wanted) * 4 +
        contractMatchRank(contractInstanceAliases(instance, true, true), wanted);
      if (rank < best) {
        best = rank;
        found = [instance];
      } else if (rank === best) found.push(instance);
    });
    return best < 12 ? found : [];
  }

  function uniqueContractCandidates(candidates) {
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key + '|' +
        String(candidate.mode && candidate.mode.id || '');
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractBehaviorContent(value, instance) {
    var content = String(value);
    var identityFields = dictionary();
    (instance.roll.labelRefs || []).concat(instance.roll.staticLabels || []).forEach(function (entry) {
      var field = trim(entry && entry.field);
      if (field) identityFields[field] = true;
    });
    Object.keys(identityFields).forEach(function (field) {
      var escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp('(\\{\\{\\s*' + escaped + '\\s*=)[^}]*(\\}\\})', 'gi'), '$1*$2');
    });
    return content.replace(/\[\[([\s\S]*?)\]\]/g, function (token, expression) {
      return '[[' + expression.replace(
        /(\b\d*d(?:\d+|%|f))(?:c[fs](?:[<>=]?[-+]?\d+(?:\.\d+)?)?)+/gi,
        '$1',
      ) + ']]';
    }).replace(/\r\n?/g, '\n').trim();
  }

  function contractCandidateEquivalenceKey(characterId, candidate, expression) {
    var instance = candidate.instance;
    var mode = candidate.mode || null;
    function normalized(values) {
      return (values || []).map(normalize).filter(Boolean).sort();
    }
    function qualifiedSignature(selectedMode) {
      var qualified = qualifyContractMacro(characterId, instance, selectedMode, expression);
      return qualified.ok
        ? ['ok', contractBehaviorContent(qualified.content, instance)]
        : ['error', qualified.reason || '', qualified.error || ''];
    }
    var modeSignatures = mode ? [] : (instance.modes || []).map(function (availableMode) {
      return [normalized(contractUserModeLabels(availableMode)), qualifiedSignature(availableMode)];
    }).sort(function (left, right) {
      return JSON.stringify(left).localeCompare(JSON.stringify(right));
    });
    var resultTemplate = sourceResultTemplateForContract(instance.contract, instance.roll.key);
    return JSON.stringify([
        normalize(instance.label),
        instance.row ? instance.row.id : '',
        instance.roll.kind || 'contract',
        mode ? normalized(contractUserModeLabels(mode)) : modeSignatures,
        qualifiedSignature(mode),
        resultTemplate || null,
        !!instance.hidden,
      ]);
  }

  function collapseEquivalentContractCandidates(characterId, candidates, expression) {
    if (candidates.length < 2) return candidates;
    var copies = dictionary();
    candidates = candidates.filter(function (candidate) {
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var labels = contractStaticLabels(roll);
      var labelKey = normalize(trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, ''));
      if (!labels.length || !roll.raw || !labels.some(function (label) {
        return normalize(label) === labelKey;
      })) return true;
      // 같은 행의 동일 출력/식 복제 버튼만 합치며 원본 계약과 키는 그대로 둡니다.
      var key = JSON.stringify([
        instance.contract.id, instance.row ? instance.row.id : '', roll.repeating || null,
        labelKey, labels, roll.raw, roll.refs || [], roll.expressionRefs || [], roll.modes || [],
        instance.hidden ? roll.visibility || null : null, !!instance.hidden, roll.kind || '', candidate.mode || null,
        roll.template || '',
      ]);
      if (copies[key]) return false;
      copies[key] = true;
      return true;
    });
    var firstContractId = candidates[0].instance.contract.id;
    if (candidates.every(function (candidate) {
      return candidate.instance.contract.id === firstContractId;
    })) return candidates;
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = contractCandidateEquivalenceKey(characterId, candidate, expression);
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function commonContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractRolls(characterId, inspection, objects, includeHidden, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    var groups = dictionary();
    actionableContractRolls(characterId, inspection, includeHidden, objects, readLive).forEach(function (instance) {
      var key = contractCandidateEquivalenceKey(characterId, { instance: instance });
      if (!groups[key]) groups[key] = instance;
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
  }

  function preferDirectContractActions(instances, compatible) {
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(preferDirectContractActions(grouped[id], compatible));
      });
      return result;
    }
    var direct = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') < 0;
    });
    var variants = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') > -1;
    });
    var addressable = variants.length && variants.every(function (instance) {
      return contractModeCandidates(instance, compatible).some(function (candidate) {
        return candidate.partialValues.length > 0;
      });
    });
    return direct.length && addressable ? direct : instances;
  }

  function preferLeastOverrideModes(candidates) {
    if (candidates.length < 2) return candidates;
    var minimum = dictionary();
    candidates.forEach(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      var count = Object.keys(contractOverrides(candidate.mode)).length;
      if (!own(minimum, key) || count < minimum[key]) minimum[key] = count;
    });
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      return Object.keys(contractOverrides(candidate.mode)).length === minimum[key];
    });
  }

  function contractModeContext(mode) {
    var found = dictionary();
    var labels = Array.isArray(mode && mode.labelPath)
      ? mode.labelPath
      : [mode && (mode.labelPath || mode.label)];
    labels.forEach(function (label) {
      String(label).split(/\s*(?:\|\||::|[|｜/>])\s*/).forEach(function (part) {
        var key = normalize(part);
        if (key) found[key] = true;
      });
    });
    return found;
  }

  function preferCurrentModeContext(characterId, candidates) {
    if (candidates.length < 2 || candidates.some(function (candidate) { return !candidate.mode; })) return candidates;
    function contextKey(candidate) {
      var rowId = candidate.instance.row ? candidate.instance.row.id : '';
      return candidate.instance.contract.id + '|' + candidate.instance.roll.key + '|' + rowId + '|' +
        Object.keys(contractOverrides(candidate.mode)).sort().join(',');
    }
    var sharedKey = contextKey(candidates[0]);
    if (candidates.some(function (candidate) { return contextKey(candidate) !== sharedKey; })) return candidates;
    var best = 0;
    var overrideKey = Object.keys(contractOverrides(candidates[0].mode)).sort().join(',');
    var currentModes = currentContractModes(characterId, candidates[0].instance).filter(function (mode) {
      return Object.keys(contractOverrides(mode)).sort().join(',') === overrideKey;
    });
    if (!currentModes.length) return candidates;
    var current = currentModes.map(contractModeContext);
    var ranked = candidates.map(function (candidate) {
      var wanted = contractModeContext(candidate.mode);
      var score = 0;
      current.forEach(function (currentLabels) {
        var overlap = Object.keys(wanted).filter(function (key) { return currentLabels[key]; }).length;
        if (overlap > score) score = overlap;
      });
      if (score > best) best = score;
      return { candidate: candidate, score: score };
    });
    return best ? ranked.filter(function (entry) { return entry.score === best; })
      .map(function (entry) { return entry.candidate; }) : candidates;
  }

  function contractMultipleRollRequest(query) {
    var matched = trim(query).match(
      /^(.+?)\s*((?:보너스|페널티|패널티)\s*(?:1|2|한\s*개|두\s*개)|bonus\s*[12]|penalty\s*[12])$/i,
    );
    return matched ? { base: trim(matched[1]), mode: trim(matched[2]) } : null;
  }

  function contractRollStructure(instance) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    var index = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var fields = repeating && index.fieldSections[repeating.section] || index.fieldGlobal;
    return raw.replace(/@\{([^{}|]+)\}/g, function (reference, name) {
      var field = fields[name] || index.fieldGlobal[name];
      if (!field) return reference;
      var value = instance.characterId
        ? getAttr(instance.characterId, contractRowAttr(instance.contract, instance.roll, instance.row, name)) : null;
      if (value === undefined || value === null || trim(value) === '') value = field.default;
      if (!/[&?]\{|\{\{/.test(String(value || ''))) return reference;
      var fragment = Object.assign({}, instance, { roll: Object.assign({}, instance.roll, { raw: reference }) });
      var qualified = qualifyContractMacro(instance.characterId, fragment);
      return qualified.ok ? qualified.content : reference;
    });
  }

  function contractInlineRollCount(instance) {
    var fields = dictionary();
    contractRollStructure(instance).replace(
      /\{\{\s*(roll\d*)\s*=\s*\[\[/gi,
      function (match, field) {
        fields[String(field).toLowerCase()] = true;
        return match;
      },
    );
    return Object.keys(fields).length;
  }

  function preferSingleInlineRollActions(candidates) {
    if (candidates.length < 2) return candidates;
    var groups = dictionary();
    candidates.forEach(function (candidate) {
      if (candidate.mode) return;
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var structure = contractRollStructure(instance);
      var baseRaw = structure
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
      var key = JSON.stringify([
        instance.contract.id,
        instance.row ? instance.row.id : '',
        normalize(instance.label),
        roll.visibility || null,
        roll.repeating || null,
        (roll.refs || []).filter(function (ref) {
          return structure.indexOf('@{' + contractRefName(ref) + (ref.max ? '|max' : '') + '}') > -1;
        }),
        roll.expressionRefs || [],
        roll.modes || [],
        baseRaw,
      ]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var chosen = dictionary();
    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      var counts = group.map(function (candidate) { return contractInlineRollCount(candidate.instance); });
      var minimum = Math.min.apply(Math, counts);
      var maximum = Math.max.apply(Math, counts);
      var best = group.filter(function (candidate) {
        return contractInlineRollCount(candidate.instance) === minimum;
      });
      if (minimum < 1 || minimum === maximum || best.length !== 1) return;
      group.forEach(function (candidate) {
        chosen[candidate.instance.contract.id + '|' + candidate.instance.key] = best[0];
      });
    });
    var seen = dictionary();
    var result = [];
    candidates.forEach(function (candidate) {
      var replacement = chosen[candidate.instance.contract.id + '|' + candidate.instance.key] || candidate;
      var key = replacement.instance.contract.id + '|' + replacement.instance.key + '|' +
        String(replacement.mode && replacement.mode.id || '');
      if (seen[key]) return;
      seen[key] = true;
      result.push(replacement);
    });
    return result;
  }

  function preferVisibleContractCandidates(candidates) {
    var visible = candidates.filter(function (candidate) {
      var instance = candidate.instance || candidate;
      return !instance.hidden;
    });
    return visible.length ? visible : candidates;
  }

  function contractMultipleRollCandidates(instances, query) {
    var requested = contractMultipleRollRequest(query);
    if (!requested) return [];
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(contractMultipleRollCandidates(grouped[id], query));
      });
      return uniqueContractCandidates(result);
    }
    var matched = closestContractActions(instances, requested.base, true);
    if (!matched.length) return [];
    var wantedMode = contractLookupKeys(requested.mode, true);
    var modes = [];
    matched.forEach(function (instance) {
      modes = modes.concat(contractModeCandidates(instance, true).filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wantedMode, false);
      }));
    });
    modes = preferLeastOverrideModes(uniqueContractCandidates(modes));
    if (modes.length) return modes;
    if (matched.length < 2) return [];
    var counts = matched.map(contractInlineRollCount);
    var maximum = Math.max.apply(Math, counts);
    var minimum = Math.min.apply(Math, counts);
    if (maximum < 2 || maximum === minimum) return [];
    return uniqueContractCandidates(matched.filter(function (instance) {
      return contractInlineRollCount(instance) === maximum;
    }).map(function (instance) { return { instance: instance, requestedMode: requested.mode }; }));
  }

  function resolveContractAction(character, query, secret, options) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: true, result: { ok: false, error: inspection.error } };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: false, result: null };
    var instances = actionableContractRolls(character.id, inspection, true).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    function exactCandidates(compatible) {
      var wanted = contractLookupKeys(query, compatible);
      var primary = instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible, true), wanted, false) ||
          contractModeCandidates(instance, compatible, true).some(function (candidate) {
            return contractKeysMatch(candidate.partialValues, wanted, false);
          });
      });
      var matching = primary.length ? primary : instances;
      var modes = [];
      matching.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(primary.length ? candidate.partialValues : candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(matching.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return preferCurrentModeContext(character.id,
        uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; }))));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    exact = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(exact));
    if (!contractLookupKeys(query, true).length) return { handled: false, result: null };
    if (exact.length === 1)
      return { handled: true, result: executeContractInstance(character, exact[0].instance, exact[0].mode ? exact[0].mode.id : '', secret) };
    var deferredModeConflict = exact.length > 1 && exact.every(function (candidate) { return !!candidate.mode; })
      ? exact : [];
    if (exact.length > 1 && !deferredModeConflict.length)
      return { handled: true, result: contractConflict(exact, secret) };
    var multipleRoll = collapseEquivalentContractCandidates(
      character.id,
      preferVisibleContractCandidates(contractMultipleRollCandidates(instances, query)),
    );
    if (multipleRoll.length === 1)
      return { handled: true, result: executeContractInstance(character, multipleRoll[0].instance,
        multipleRoll[0].mode ? multipleRoll[0].mode.id : '', secret, undefined, multipleRoll[0].requestedMode) };
    if (multipleRoll.length > 1) return { handled: true, result: contractConflict(multipleRoll, secret) };
    if (options && options.exactOnly) return { handled: false, result: null, inspection: inspection };
    var wanted = contractLookupKeys(query, true);
    var partialActions = preferDirectContractActions(preferVisibleContractCandidates(
      closestContractActions(instances, query),
    ), true);
    var partialActionRank = partialActions.length
      ? contractMatchRank(contractInstanceAliases(partialActions[0], true), wanted)
      : 3;
    var partial;
    if (partialActions.length) {
      partial = uniqueContractCandidates(partialActions.map(function (instance) { return { instance: instance }; }));
    } else {
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, true)); });
      var directModes = modes.filter(function (candidate) {
        return contractKeysMatch(candidate.modeValues, wanted, true);
      });
      var matchingModes = directModes.length ? directModes : modes.filter(function (candidate) {
        return contractMatchRank(candidate.partialValues, wanted) < 2;
      });
      partial = preferLeastOverrideModes(uniqueContractCandidates(matchingModes));
    }
    partial = preferCurrentModeContext(character.id, partial);
    partial = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(partial));
    if (partial.length === 1 && (!deferredModeConflict.length || partialActionRank === 1))
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (deferredModeConflict.length)
      return { handled: true, result: contractConflict(deferredModeConflict, secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
    var roleNames = Object.keys(DETECTED_ROLE_LABELS).filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(normalize(query)) > -1;
    });
    if (roleNames.length === 1) {
      var detected = detectedRollRole(scan(character.id), roleNames[0]);
      if (detected.item)
        return { handled: true, result: executeContractInstance(character, detected.item, '', secret) };
    }
    return { handled: false, result: null, inspection: inspection };
  }

  function executeContractExpression(character, expressionText, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous') return null;
    var safe = safeUserRollExpression(character.id, expressionText);
    if (!safe) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    var instances = actionableContractRolls(character.id, inspection, false).filter(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    }).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    if (!instances.length) return { ok: false, error: '현재 시트에는 식을 바꿔 굴릴 수 있는 항목이 없습니다.' };
    instances = collapseEquivalentContractCandidates(character.id, instances.map(function (instance) {
      return { instance: instance };
    }), safe).map(function (candidate) { return candidate.instance; });
    if (instances.length > 1)
      return contractConflict(instances.map(function (instance) { return { instance: instance }; }), secret, expressionText);
    return executeContractInstance(character, instances[0], '', secret, safe);
  }

  function sortedUnique(values) {
    var seen = dictionary();
    return (values || []).map(trim).filter(function (value) {
      var key = normalize(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    }).sort(function (left, right) { return left.localeCompare(right); });
  }

  var ROLL_STATUS_GROUPS = [
    { key: 'characteristic', title: '특성치' },
    { key: 'check', title: '기능 / 판정' },
    { key: 'combat', title: '무기' },
    { key: 'spell', title: '주문' },
    { key: 'madness', title: '광기' },
    { key: 'other', title: '기타 주사위' },
  ];

  function rollStatusContext(instance) {
    var roll = instance && instance.roll || {};
    var groups = [];
    var labels = contractStaticLabels(roll).concat(roll.aliases || []);
    var sourceRaw = contractRollStructure(instance);
    var structure = [roll.template].concat(sourceTemplateFieldNames(sourceRaw));
    var repeating = contractRepeating(roll);
    if (repeating && instance && instance.contract) {
      var index = contractRuntimeIndex(instance.contract);
      var fields = index.fieldSections[repeating.section] || dictionary();
      contractRollFields(instance.contract, roll, index.controls).forEach(function (name) {
        var field = fields[name];
        if (!field) return;
        groups.push(field.groupLabel);
        structure.push(field.label);
        structure = structure.concat(field.aliases || []);
      });
    }
    return {
      sourceRaw: sourceRaw,
      groups: sortedUnique(groups.map(contractDisplayLabel).filter(Boolean)),
      labels: sortedUnique(labels.map(contractDisplayLabel).filter(Boolean)),
      structure: sortedUnique(structure.map(trim).filter(Boolean)),
    };
  }

  function rollStatusMatches(labels, pattern) {
    return (labels || []).some(function (label) { return pattern.test(trim(label)); });
  }

  function rollStatusLabel(instance) {
    var roll = instance && instance.roll || {};
    var rollName = normalize(roll.name);
    var rollKey = normalize(roll.key);
    return [instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
      var key = normalize(label);
      return key && key !== rollName && key !== rollKey;
    })[0] || '';
  }

  function rollHasOutcomeStructure(item) {
    var roll = item && item.roll || {};
    var resultTemplates = item && item.contract && item.contract.resultTemplates;
    var template = resultTemplates && resultTemplates[roll.template];
    if (!template || !Array.isArray(template.rules)) return false;
    var sourceFields = dictionary();
    function addFields(raw) {
      sourceTemplateFieldNames(raw).forEach(function (name) { sourceFields[name] = true; });
    }
    addFields(item.sourceRaw || roll.raw);
    (roll.modes || []).forEach(function (mode) {
      var overrides = contractOverrides(mode);
      Object.keys(overrides).forEach(function (name) { addFields(overrides[name]); });
      contractQueries(mode).forEach(function (query) {
        addFields(query.raw);
        addFields(query.value);
      });
    });
    var matched = dictionary();
    template.rules.forEach(function (rule) {
      if (!rule || !rule.outcome) return;
      var refs = [rule.valueField];
      (rule.conditions || []).forEach(function (condition) { refs = refs.concat(condition.args || []); });
      refs.forEach(function (name) {
        name = trim(name).toLowerCase();
        if (sourceFields[name]) matched[name] = true;
      });
    });
    return Object.keys(matched).length > 1;
  }

  function rollHasPercentileThreshold(item) {
    var raw = String(item && (item.sourceRaw || item.roll && item.roll.raw) || '');
    if (!/\b(?:\d+)?d100/i.test(raw) || !/@\{[^}]+\}/.test(raw)) return false;
    return sourceTemplateFieldNames(raw).some(function (name) {
      return /(?:^|[_-])(?:stat|threshold|target|success|skill|ability|characteristic|score)(?:$|[_-])/i.test(name);
    });
  }

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    if (/&\{tracker\}/i.test(String(item && item.roll && item.roll.raw || ''))) return 'other';
    var context = (item.contextLabels || []).concat([item.label]);
    if (!contractRepeating(item.roll) && (matchesDetectedRole(context, 'characteristic') ||
        rollStatusMatches(item.structureLabels, /(?:^|[_-])characteristic(?:$|[_-])/i))) return 'characteristic';
    if (rollHasOutcomeStructure(item) || rollHasPercentileThreshold(item)) return 'check';
    if (rollStatusMatches(context, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(context, /(?:주문|마법|주술|spell|magic|ritual)/i)) return 'spell';
    if (rollStatusMatches(context, /(?:무기|weapon)/i)) return 'combat';
    return 'other';
  }

  function groupedRollItems(items) {
    var groups = dictionary();
    ROLL_STATUS_GROUPS.forEach(function (group) { groups[group.key] = []; });
    (items || []).forEach(function (item) { groups[rollStatusCategory(item)].push(item); });
    return ROLL_STATUS_GROUPS.map(function (group) {
      return { key: group.key, title: group.title, items: groups[group.key] };
    });
  }

  function statusResourceItems(data) {
    return (data && data.resources || []).filter(function (item) { return item.statusResource === true; });
  }

  function rollGroupSections(items, renderItem) {
    return groupedRollItems(items).filter(function (group) { return group.items.length; }).map(function (group) {
      return section(group.title + ' ' + group.items.length + '개', group.items.map(renderItem).join(' '));
    }).join('');
  }

  function contractRollDisplayValue(data, instance) {
    var characterId = data.characterId;
    var tr = /\{\{\s*(?:[^={}]*?(?:threshold|target)[^={}]*|stat|s(?:core|uccess|kill)|ability|characteristic)\s*=\s*\[\[([\s\S]*?)\]\]\s*\}\}/i;
    var tm = String(instance.roll.raw).match(tr);
    var m = tm ? qualifyContractMacro(characterId, Object.assign({}, instance, {
      roll: Object.assign({}, instance.roll, { raw: tm[0] }),
    }), null) : null;
    if (m && m.ok) {
      var v = m.content.match(tr);
      var n = v && resolvedResourceValue(characterId, v[1]);
      if (n && n.number !== null) return n.text;
    }
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = data.attributeByName || dictionary();
    contractControls(instance.contract, instance.roll).forEach(function (control) {
      var name = contractControlName(control);
      if (name) ignored[name] = true;
    });
    String(instance && instance.roll && instance.roll.raw || '').replace(
      /@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g,
      function (match, name, valueType) {
        if (ignored[name]) return match;
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var refKey = fullName + '|' + (valueType || 'current');
        if (seenRefs[refKey]) return match;
        seenRefs[refKey] = true;
        var resource = data.resourcesByAttribute && data.resourcesByAttribute[fullName];
        var property = valueType === 'max' ? 'max' : 'value';
        var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        if (field && /^(?:checkbox|radio)$/i.test(trim(field.type))) return match;
        var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
        if ((fallback === undefined || fallback === null || trim(fallback) === '') && valueType !== 'max') {
          var control = sourceControls[name] || runtimeIndex.controls[name];
          fallback = control && control.default;
        }
        var stored = savedAttributes[fullName];
        var live = stored ? null : getAttr(characterId, fullName, valueType || 'current');
        var raw = resource && own(resource, property) && resource[property] !== null
          ? resource[property]
          : stored ? stored.get(valueType === 'max' ? 'max' : 'current')
            : field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled &&
              fallback !== undefined && fallback !== null && trim(fallback) !== ''
              ? contractUnsavedFieldValue(field, live, fallback, valueType === 'max') : live;
        if (raw === undefined) return match;
        var resolved = resolvedResourceValue(characterId, raw);
        if (resolved.number === null || seenValues[resolved.text]) return match;
        seenValues[resolved.text] = true;
        values.push(resolved.text);
        return match;
      },
    );
    return values.length === 1 ? values[0] : '';
  }

  function contractRollDamageText(characterId, instance) {
    var qualified = qualifyContractMacro(characterId, instance, null);
    if (!qualified.ok) return '';
    var fields = messageTemplateFields({ content: qualified.content });
    var name = Object.keys(fields).filter(function (key) {
      return /^(?:피해|damage|dmg)$/i.test(trim(key));
    })[0];
    var value = trim(name && fields[name]);
    var inline = value.match(/^\[\[([\s\S]*)\]\]$/);
    return trim(inline ? inline[1] : value);
  }

  function contractSelectionCommand(characterId, instance, count, secret) {
    return count > 1
      ? '!시트 굴림목록|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.label) + '|' + (secret ? '1' : '0')
      : '!시트 굴림선택|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.contract.id) + '|' +
        encodeURIComponent(instance.roll.key) + '|' + encodeURIComponent(instance.row ? instance.row.id : '') + '||' +
        (secret ? '1' : '0') + '|';
  }

  function recognizedRollItems(data) {
    var result = [];
    if (usableContractInspection(data.contractMatch)) {
      var rolls = preferredContractRolls(data);
      var counts = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data, instance),
          modes: sortedUnique((instance.modes || []).reduce(function (labels, mode) {
            return labels.concat(contractUserModeLabels(mode));
          }, [])),
          command: contractSelectionCommand(data.characterId, instance, counts[key], false),
        });
      });
    }
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeEntries(characterId, instance) {
    var groups = dictionary();
    var candidates = contractModeCandidates(instance, true);
    var current = currentContractModes(characterId, instance);
    var context = rollStatusContext(instance);
    var category = rollStatusCategory({
      label: rollStatusLabel(instance), groupLabels: context.groups, contextLabels: context.labels,
      structureLabels: context.structure, sourceRaw: context.sourceRaw, contract: instance.contract, roll: instance.roll,
    });
    if (current.length && category === 'combat') candidates = candidates.filter(function (candidate) {
      return current.indexOf(candidate.mode) > -1 || contractUserModeLabels(candidate.mode).some(function (label) {
        return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label));
      });
    });
    candidates.forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      var parts = labels.join(' | ').split(/\s*(?:\|\||::|[|｜/>])\s*/).map(normalize).filter(Boolean);
      var key = parts.length ? parts[parts.length - 1] : trim(candidate.mode && candidate.mode.id);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var selected = [];
    Object.keys(groups).forEach(function (key) {
      selected = selected.concat(preferCurrentModeContext(characterId, groups[key]));
    });
    var result = [];
    uniqueContractCandidates(selected).forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      labels.filter(function (label) {
        var key = normalize(label);
        if (labels.some(function (other) {
          return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(other));
        }) && /^\d+\s*개(?:\s|$)/.test(label) &&
            !contractDisplayLabel(label.replace(/^\d+\s*개\s*/, ''))) return false;
        return !/(?:보너스|패널티|페널티|bonus|penalty)/i.test(key) || !labels.some(function (other) {
          var otherKey = normalize(other);
          return otherKey.indexOf(key) === 0 && /^\+?\d+(?:개)?$/.test(otherKey.slice(key.length));
        });
      }).forEach(function (label) {
        result.push({
          id: trim(candidate.mode.id), label: label,
          modifier: /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label)),
        });
      });
    });
    return result;
  }

  function statusRollIdentity(instance) {
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    var source = trim(roll.name) ? 'name:' + trim(roll.name) : 'raw:' + String(roll.raw || '');
    return JSON.stringify([
      instance && instance.contract && instance.contract.id || '',
      roll.kind || 'contract',
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
      source,
      instance && instance.modes || [],
    ]);
  }

  function statusRollLabelIdentity(instance) {
    if (!rollStatusLabel(instance)) return '';
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(rollStatusLabel(instance)),
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
    ]);
  }

  function statusRollItems(data, includeEveryInstance) {
    var result = [];
    var counts = dictionary();
    var seen = dictionary();
    var seenLabels = dictionary();
    if (!usableContractInspection(data.contractMatch)) return result;
    // 같은 행이 원본 정렬에 여러 번 있으면 유지하고, 그 행의 보조 버튼만 제외합니다.
    var instances = includeEveryInstance ? data.contractRolls : preferredContractRolls(data);
    instances.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    instances.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = statusRollIdentity(instance);
      if (!key) return;
      var modeEntries = statusModeEntries(data.characterId, instance);
      if (!includeEveryInstance && seen[key] &&
          (!instance.row || seen[key].roll.key !== instance.roll.key)) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      var context = rollStatusContext(instance);
      var item = {
        label: label,
        value: contractRollDisplayValue(data, instance),
        command: contractSelectionCommand(data.characterId, instance, counts[normalize(instance.label)] || 1, false),
        modeEntries: modeEntries,
        groupLabels: context.groups,
        contextLabels: context.labels,
        structureLabels: context.structure,
        sourceRaw: context.sourceRaw,
        contract: instance.contract,
        roll: instance.roll,
      };
      if (!label && (!modeEntries.length || rollStatusCategory(item) !== 'madness')) return;
      if (rollStatusCategory(item) === 'combat')
        item.damage = contractRollDamageText(data.characterId, instance);
      if (!seen[key]) seen[key] = item;
      var labelKey = statusRollLabelIdentity(instance);
      if (labelKey && !seenLabels[labelKey]) seenLabels[labelKey] = item;
      result.push(item);
    });
    (data.contractAllRolls || []).forEach(function (instance) {
      if (!instance.hidden) return;
      var item = seen[statusRollIdentity(instance)] || seenLabels[statusRollLabelIdentity(instance)];
      if (item) item.modeEntries = item.modeEntries.concat(statusModeEntries(data.characterId, instance));
    });
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeLayout(rolls) {
    var uses = dictionary();
    (rolls || []).forEach(function (item) {
      (item.modeEntries || []).forEach(function (entry) {
        if (!entry.id) return;
        uses[entry.id] = uses[entry.id] || dictionary();
        uses[entry.id][item.roll.key] = true;
      });
    });
    var shared = dictionary();
    Object.keys(uses).forEach(function (id) {
      if (Object.keys(uses[id]).length > 1) shared[id] = true;
    });
    var diceTypes = [];
    var madnessModes = dictionary();
    var items = [];
    (rolls || []).forEach(function (item) {
      var localModes = item.damage ? ['피해 ' + item.damage] : [];
      (item.modeEntries || []).forEach(function (entry) {
        if (entry.modifier) diceTypes.push(entry.label);
        else if (!shared[entry.id]) localModes.push(entry.label);
      });
      localModes = sortedUnique(localModes);
      if (rollStatusCategory(item) === 'madness' && localModes.length) {
        localModes.forEach(function (label) {
          var key = normalize(label);
          if (madnessModes[key]) return;
          madnessModes[key] = true;
          items.push(merge(merge({}, item), {
            label: label, value: '', localModes: [], contextLabels: (item.contextLabels || []).concat(item.label),
          }));
        });
        return;
      }
      item.localModes = localModes;
      items.push(item);
    });
    return { items: items, diceTypes: sortedUnique(diceTypes) };
  }

  function itemDetailText(data, detail) {
    var value = detail && detail[1];
    if (value === undefined || value === '') return '';
    return escapeHtml(detail[0]) + ' ' + escapeHtml(resolvedResourceValue(data.characterId, value).text || '-');
  }

  function searchHtml(data, query) {
    var wanted = normalize(query);
    var items = recognizedRollItems(data).concat(statusResourceItems(data).map(function (item) {
      return {
        kind: 'resource', label: item.label, aliases: item.aliases,
        value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)), command: '',
      };
    }));
    items = items.filter(function (item) {
      return [item.label].concat(item.aliases || []).some(function (value) {
        var key = normalize(value);
        return key && (key.indexOf(wanted) > -1 || wanted.indexOf(key) > -1);
      });
    }).sort(function (left, right) { return left.label.localeCompare(right.label); });
    if (!items.length)
      return '<b>' + escapeHtml(query) + '</b>과 이름이 비슷한 항목을 찾지 못했습니다.';
    var labels = { contract: '굴림', resource: '수치' };
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / ' + escapeHtml(query) + ' 검색</b></div><table style="width:100%;border-collapse:collapse">' +
      items.map(function (item) {
        var details = (item.details || []).map(function (detail) { return itemDetailText(data, detail); }).filter(Boolean);
        return '<tr><td style="padding:7px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b> ' +
          '<span style="color:#777;font-size:11px">' + escapeHtml(labels[item.kind] || '항목') + '</span>' +
          (item.value !== '' && item.value !== undefined ? '<br><span style="color:#333">현재 ' + escapeHtml(item.value) + '</span>' : '') +
          (details.length ? '<br><span style="color:#555;font-size:11px">' + details.join(' / ') + '</span>' : '') + '</td>' +
          '<td style="padding:7px;text-align:right;white-space:nowrap">' +
          (item.command ? button('굴리기', item.command, '#111') : '') + '</td></tr>';
      }).join('') + '</table></div>';
  }

  function button(label, command, color) {
    return '<a href="' + escapeHtml(command) + '" style="display:inline-block;margin:2px 1px;padding:5px 8px;background:' +
      (color || '#53657d') + ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' + escapeHtml(label) + '</a>';
  }

  function section(title, body) {
    return '<div style="margin-top:10px;border:1px solid #111;background:#fff;color:#111"><div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">' +
      escapeHtml(title) + '</div><div style="padding:8px">' + body + '</div></div>';
  }

  function recognizedTable(items, actions) {
    return '<table style="width:100%;border-collapse:collapse"><tr>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">항목</th>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">현재값 / 방식</th>' +
      (actions ? '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:right">실행</th>' : '') + '</tr>' +
      (items || []).map(function (item) {
        var detail = [];
        if (item.value !== '' && item.value !== undefined) detail.push('<b>' + escapeHtml(item.value) + '</b>');
        if (item.localModes && item.localModes.length) detail.push(item.localModes.map(escapeHtml).join(' / '));
        return '<tr><td style="padding:6px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b></td>' +
          '<td style="padding:6px;border-bottom:1px solid #ddd">' + detail.join('<br>') + '</td>' +
          (actions ? '<td style="padding:4px 6px;border-bottom:1px solid #ddd;text-align:right;white-space:nowrap">' +
            (item.command ? button('실행', item.command, '#111') : '') + '</td>' : '') + '</tr>';
      }).join('') + '</table>';
  }

  function recognizedTablesHtml(data, actions, includeEveryInstance) {
    var layout = statusModeLayout(statusRollItems(data, includeEveryInstance));
    var groups = dictionary();
    groupedRollItems(layout.items).forEach(function (group) { groups[group.key] = group; });
    var html = '';
    ['characteristic', 'check', 'combat', 'spell', 'madness'].forEach(function (key) {
      var group = groups[key];
      if (group && group.items.length) html += section(group.title + ' ' + group.items.length + '개', recognizedTable(group.items, actions));
    });
    var statusResources = statusResourceItems(data);
    if (statusResources.length) {
      var resources = statusResources.map(function (item) {
        return {
          label: item.label,
          value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)),
        };
      });
      html += section('수치 ' + resources.length + '개', recognizedTable(resources, false));
    }
    if (groups.other && groups.other.items.length)
      html += section(groups.other.title + ' ' + groups.other.items.length + '개', recognizedTable(groups.other.items, actions));
    if (layout.diceTypes.length)
      html += section('다이스 종류 ' + layout.diceTypes.length + '개', recognizedTable(layout.diceTypes.map(function (label) {
        return { label: label, value: '' };
      }), false));
    return html;
  }

 function cutinItems() {
    var found = dictionary();
    var sourceLabels = dictionary();
    function add(item, kind, system, key, characterName) {
      if (!item || !trim(item.label)) return;
      system = system || 'sheet';
      key = key || resultKey(system, item.label);
      if (!found[key]) found[key] = {
        key: key, label: item.label, kind: kind, system: system,
        aliases: item.aliases || [], characterName: characterName || '',
        command: item.command || '', type: item.type || '',
      };
    }
    var character = profileCharacters()[0];
    if (character) {
      (scan(character.id).contractRolls || []).forEach(function (instance) {
        var key = contractCutinKey(instance);
        if (!found[key]) {
          var seenLabels = dictionary();
          sourceLabels[key] = [instance.roll.label].concat(instance.roll.aliases || [])
            .map(contractDisplayLabel).filter(function (label) {
              var labelKey = normalize(label);
              if (!labelKey || seenLabels[labelKey] || labelKey === normalize(instance.label) ||
                  labelKey === normalize(instance.roll.name) || labelKey === normalize(instance.roll.key)) return false;
              seenLabels[labelKey] = true;
              return true;
            });
        }
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          key,
          character.get('name'),
        );
      });
    }
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    var sourceLabelCounts = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
      var labels = sourceLabelCounts[labelKey] || (sourceLabelCounts[labelKey] = dictionary());
      (sourceLabels[item.key] || []).forEach(function (label) {
        var key = normalize(label);
        labels[key] = (labels[key] || 0) + 1;
      });
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      var sourceLabel = (sourceLabels[item.key] || []).filter(function (label) {
        return sourceLabelCounts[labelKey][normalize(label)] < counts[labelKey];
      })[0];
      item.displayLabel = item.label + ' (' + (sourceLabel ? sourceLabel + ' / ' : '') +
        (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
    });
    return items;
  }

  function managerHtml() {
    var data = initState();
    var characters = profileCharacters();
    if (!characters.some(function (character) { return character.id === data.managerCharacterId; }))
      data.managerCharacterId = characters.length ? characters[0].id : '';
    var characterButtons = characters.length
      ? characters.map(function (character) {
          return button(
            character.id === data.managerCharacterId ? '✓ ' + character.get('name') : character.get('name'),
            '!시트 현황보기|' + character.id,
            character.id === data.managerCharacterId ? '#111' : '#53657d',
          );
        }).join(' ')
      : '<span style="color:#777">' + SHEET_NOT_RECOGNIZED + '</span>';
    var trackingLabel = data.trackingMode === 'public' ? '전체 공개' : data.trackingMode === 'gm' ? 'GM만' : '끄기';
    var trackingControls = '<b>수치 변화 알림:</b> ' + trackingLabel + '<br>' +
      button('전체 공개', '!시트 변화알림|공개', data.trackingMode === 'public' ? '#111' : '#53657d') + ' ' +
      button('GM만', '!시트 변화알림|GM', data.trackingMode === 'gm' ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 변화알림|끄기', data.trackingMode === 'off' ? '#111' : '#53657d') +
      '<br><b>플레이어 권한이 없는 GM 캐릭터도 알림:</b> ' + (data.trackGmOnly ? '켜기' : '끄기') + '<br>' +
      button('켜기', '!시트 GM캐릭터알림|켜기', data.trackGmOnly ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 GM캐릭터알림|끄기', data.trackGmOnly ? '#53657d' : '#111');
    var body =
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎲 시트 헬퍼 관리</b></div>' +
      section('설정', button('시트 다시 읽기', '!시트 새로고침', '#287a4b') + '<br><br>' + trackingControls) +
      section('캐릭터별 현황 보기', '<span style="color:#555;font-size:11px">API가 인식한 현재 캐릭터들 현황 모아보기</span><br>' + characterButtons);
    var viewed = data.managerCharacterId && scan(data.managerCharacterId);
    if (viewed && viewed.ok) {
      var hasContract = usableContractInspection(viewed.contractMatch);
      var issues = (viewed.warnings || []).slice();
      if (hasContract) {
        var modesIncomplete = viewed.contractRolls.some(function (instance) {
          return instance.roll && instance.roll.modesIncomplete === true;
        });
        if (modesIncomplete)
          issues.push('일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다. 해당 굴림은 시트에서 직접 실행해 주세요.');
        body += recognizedTablesHtml(viewed, false);
      } else body += section('인식 결과', SHEET_NOT_RECOGNIZED);
      if (issues.length) body += section('확인할 항목', issues.map(escapeHtml).join('<br>'));
    }
    return body + '</div>';
  }

  function managerHandout() {
    var data = initState();
    var handout = getObj('handout', data.managerId) || (findObjs({ _type: 'handout', name: sheet_helper_setting.manager_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', { name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false });
    if (!handout) return null;
    data.managerId = handout.id;
    var html = managerHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.managerHash !== hash) {
      handout.set({ name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false, notes: html });
      data.managerHash = hash;
    }
    return handout;
  }

  function playerHelpHandout() {
    var data = initState();
    var handout = getObj('handout', data.playerHelpId) ||
      (findObjs({ _type: 'handout', name: sheet_helper_setting.player_help_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
      });
    if (!handout) return null;
    data.playerHelpId = handout.id;
    var html = playerHelpHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.playerHelpHash !== hash) {
      handout.set({
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
        notes: html,
      });
      data.playerHelpHash = hash;
    }
    return handout;
  }

  function simpleHash(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  function scheduleManager() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      try {
        managerHandout();
        playerHelpHandout();
        var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
        if (cutin && typeof cutin.refreshSheetControls === 'function')
          cutin.refreshSheetControls();
      } catch (err) {
        whisperGm('시트 헬퍼 관리 갱신 오류: ' + escapeHtml(err.message || err));
      }
    }, sheet_helper_setting.refresh_delay);
  }

  function openManager() {
    var handout = managerHandout();
    return handout
      ? '<a href="http://journal.roll20.net/handout/' + encodeURIComponent(handout.id) + '" style="display:inline-block;padding:5px 8px;background:#111;color:#fff;text-decoration:none;font-weight:bold">시트 헬퍼 관리 열기</a>'
      : '관리 핸드아웃을 만들지 못했습니다.';
  }

  function playerName(msg) {
    var player = getObj('player', msg.playerid);
    return player ? trim(player.get('_displayname')) : trim(msg.who).replace(/\s*\(GM\)\s*$/, '') || 'gm';
  }

  function whisper(msg, text) {
    sendChat('시트 헬퍼', '/w "' + playerName(msg).replace(/"/g, '') + '" ' + safeWhisperText(text), null, { noarchive: true });
  }

  function whisperGm(text) {
    sendChat('시트 헬퍼', '/w gm ' + safeWhisperText(text), null, { noarchive: true });
  }

  function safeWhisperText(text) {
    return String(text == null ? '' : text).replace(/@\{/g, '&#64;{');
  }

  function switchSpeaker(msg, query) {
    if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
    var player = getObj('player', msg.playerid);
    if (!player) return whisper(msg, '화자를 바꿀 플레이어 정보를 찾지 못했습니다.');
    var rawDisplayName = trim(player.get('_displayname'));
    var displayName = rawDisplayName.replace(/\s*\(GM\)\s*$/i, '');
    if (
      normalize(query) === normalize(rawDisplayName) ||
      normalize(query) === normalize(displayName) ||
      /^(?:나|본인|해제|끄기|off)$/i.test(trim(query))
    ) {
      if (player.get('speakingas')) player.set({ speakingas: '' });
      return whisper(msg, '화자: <b>' + escapeHtml(player.get('_displayname')) + '</b>');
    }
    var found = resolveCharacterName(query, characterObjects());
    if (!found.ok) return whisper(msg, escapeHtml(found.error));
    var speakingAs = 'character|' + found.character.id;
    if (player.get('speakingas') !== speakingAs) player.set({ speakingas: speakingAs });
    return whisper(msg, '화자: <b>' + escapeHtml(found.character.get('name')) + '</b>');
  }

  function helpHtml() {
    return playerHelpHtml() +
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #aaa"><b>GM 명령어</b><br>' +
      '<code>!!관리</code> 캐릭터별 인식 항목과 현재 수치 현황<br>' +
      '<code>!!점검</code> 현황에서 확인 중인 캐릭터의 인식 상태 점검<br>' +
      '<code>!!화자 이름</code> 채팅 화자 전환<br>' +
      '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀<br>' +
      '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위<br>' +
      '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함</div>';
  }

  function playerHelpHtml() {
    var character = profileCharacters()[0];
    var contractFree = !!character && scannedContractRolls(character.id, true).some(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    });
    var rows = [
      ['!!굴릴항목이름', '해당 항목을 굴립니다. 예: <code>!!관찰력</code>'],
      ['!!비밀 굴릴항목이름', '결과를 GM에게만 보냅니다. 예: <code>!!비밀 관찰력</code>'],
      ['!!굴릴항목이름 보너스/패널티개수', '보너스 또는 패널티 주사위 개수를 붙여 굴립니다. 예: <code>!!관찰력 보너스1</code>, <code>!!관찰력 패널티2</code>'],
      ['!!검색 이름', '이름이 비슷한 항목과 현재 수치를 찾아 바로 굴립니다.'],
      ['!!상태', '내 캐릭터에서 인식된 굴림과 수치를 가나다순으로 봅니다.'],
      [':수치이름+3', '내 캐릭터 수치를 바꿉니다. 예: <code>:체력-1d3</code>, <code>:마력=10</code>'],
    ];
    if (contractFree)
      rows.push(['!!r 2d6+3', '현재 시트의 자유 주사위 디자인으로 식을 굴립니다.']);
    return (
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:10px;background:#111;color:#fff"><b>시트 헬퍼 사용법</b></div>' +
      '<table style="width:100%;border-collapse:collapse">' + rows.map(function (row) {
        return '<tr><td style="width:42%;padding:7px 8px;border-bottom:1px solid #ddd;background:#f5f5f5;vertical-align:top"><code style="font-weight:bold">' +
          escapeHtml(row[0]) + '</code></td><td style="padding:7px 8px;border-bottom:1px solid #ddd;vertical-align:top">' + row[1] + '</td></tr>';
      }).join('') + '</table><div style="padding:8px 10px">' +
      button('내 상태 보기', '!!상태', '#111') + ' ' +
      button('항목 검색', '!!검색 ?{찾을 이름}', '#111') +
      '<br><span style="color:#555;font-size:11px">이름 일부가 여러 항목과 맞으면 검정 선택 버튼으로 고를 수 있습니다.</span></div></div>'
    );
  }

  function statusHtml(data) {
    var rolls = statusRollItems(data);
    var modeLayout = statusModeLayout(rolls);
    var body = '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / 시트 현황</b></div>';
    body += modeLayout.items.length ? rollGroupSections(modeLayout.items, function (item) {
      return '<span style="display:inline-block;margin:0 8px 3px 0">' + escapeHtml(item.label) +
        (item.value ? ' <b>' + escapeHtml(item.value) + '</b>' : '') +
        (item.localModes && item.localModes.length ? ' <span style="color:#555">(' + item.localModes.map(escapeHtml).join(' / ') + ')</span>' : '') + '</span>';
    }) : section('굴릴 항목', '<span style="color:#777">없음</span>');
    if (modeLayout.diceTypes.length)
      body += section('다이스 종류 ' + modeLayout.diceTypes.length + '개', modeLayout.diceTypes.map(escapeHtml).join(', '));
    var statusResources = statusResourceItems(data);
    if (statusResources.length)
      body += section('현재 수치 ' + statusResources.length + '개', statusResources.map(function (item) {
        return escapeHtml(item.label) + ' <b>' + escapeHtml(fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item))) + '</b>';
      }).join(', '));
    return body + '<div style="padding:8px 10px;color:#555;font-size:11px">항목을 좁혀 보려면 <code>!!검색 이름</code>을 입력하세요.</div></div>';
  }

  function inspectionHtml(data) {
    var recognition = data.contractMatch || {};
    var incomplete = usableContractInspection(data.contractMatch)
      ? (data.contractRolls || []).filter(function (instance) { return instance.roll && instance.roll.modesIncomplete === true; }).length
      : 0;
    var issues = (data.warnings || []).slice();
    if (incomplete) issues.push('선택 방식을 전부 안전하게 읽지 못한 굴림 ' + incomplete + '개');
    if (recognition.contractCount && !usableContractInspection(recognition))
      issues.push('설치된 시트 인식 정보가 방의 저장 항목과 일치하지 않습니다.');
    var matched = usableContractInspection(recognition);
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / GM 인식 점검</b></div>' +
      section('인식 결과', matched
        ? '<b>인식 완료</b> / 현재 캐릭터의 굴림 ' + data.contractRolls.length + '개 / 수치 ' + statusResourceItems(data).length + '개'
        : SHEET_NOT_RECOGNIZED) +
      (matched ? recognizedTablesHtml(data, false, true) : '') +
      section('확인할 항목', issues.length ? issues.map(escapeHtml).join('<br>') : '<span style="color:#287a4b">확인할 문제가 없습니다.</span>') +
      '</div>';
  }

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices) : escapeHtml(result.error));
    else if (result && result.queryOnly)
      whisper(msg, '<b>' + escapeHtml(result.weapon.label) + '</b> 탄약: ' + escapeHtml(result.value === '' ? '-' : result.value));
    return result;
  }

  function withCharacter(msg, explicitId, callback) {
    var resolved = resolveCharacter(msg, explicitId);
    if (!resolved.ok) return reportResult(msg, resolved);
    return reportResult(msg, callback(resolved.character));
  }

  function uniqueResources(items) {
    var seen = dictionary();
    return (items || []).filter(function (item) {
      if (!item || seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
  }

  function resolveResource(data, query) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '바꿀 수치 이름을 적어 주세요.' };
    var exact = uniqueResources(data.resourceAliases[wanted] || []);
    if (exact.length === 1) return { ok: true, item: exact[0] };
    var primary = exact.filter(function (item) {
      return normalize(item.label) === wanted || normalize(item.name) === wanted;
    });
    if (primary.length === 1) return { ok: true, item: primary[0] };
    if (exact.length > 1)
      return { ok: false, error: '같은 이름의 수치가 여러 개입니다: ' + exact.map(function (item) { return item.label; }).join(', ') };
    var roles = ['health', 'magicPoints', 'sanity', 'startingSanity'].filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(wanted) > -1;
    });
    if (roles.length === 1) {
      var detected = detectedFieldRole(data, roles[0], 'resource');
      if (detected.item) return { ok: true, item: detected.item };
    }
    var partial = uniqueResources((data.resources || []).filter(function (item) {
      return item.aliases.some(function (alias) { return normalize(alias).indexOf(wanted) > -1; });
    }));
    if (partial.length === 1) return { ok: true, item: partial[0] };
    if (partial.length > 1)
      return { ok: false, error: '이름이 비슷한 수치가 여러 개입니다: ' + partial.map(function (item) { return item.label; }).join(', ') };
    return { ok: false, error: '현재 시트에서 ' + trim(query) + ' 수치를 찾지 못했습니다.' };
  }

  function rollAmount(expression) {
    var source = trim(expression || '');
    var dice = source.match(/^(\d*)d(\d+)$/i);
    if (!dice) {
      var fixed = Number(source);
      return isFinite(fixed) ? { ok: true, value: fixed, detail: source } : { ok: false };
    }
    var count = Number(dice[1] || 1);
    var sides = Number(dice[2]);
    if (count < 1 || count > 100 || sides < 1 || sides > 100000) return { ok: false };
    var rolls = [];
    var total = 0;
    for (var i = 0; i < count; i += 1) {
      var rolled = randomInteger(sides);
      rolls.push(rolled);
      total += rolled;
    }
    return { ok: true, value: total, detail: source + ' [' + rolls.join(', ') + ']' };
  }

  function toggleValue(value) {
    var normalized = trim(value).toLowerCase();
    if (/^(?:1|on|true)$/.test(normalized)) return true;
    if (/^(?:0|off|false|)$/.test(normalized)) return false;
    return null;
  }

  function sanityValueText(characterId, item, current, hideMaximum) {
    var data = scan(characterId);
    var sanity = detectedFieldRole(data, 'sanity', 'number');
    if (!sanity.item || sanity.item.name !== item.name) return '';
    var starting = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = starting.item && numericFieldValue(characterId, resourceRawValue(characterId, starting.item));
    var hasStarting = starting.item && starting.item.name !== item.name && startingValue > 0;
    var hasStartingField = starting.matches.length || sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return (candidate.contract.fields || []).some(function (field) {
        var labels = [field.label].concat(field.aliases || []);
        return matchesDetectedRole(labels, 'startingSanity') ||
          linkedStartingSanityField(field, sanity.item.name, labels);
      });
    });
    var text = String(current);
    if (hasStarting)
      text += ' / 시작 ' + startingValue +
        ' (' + Math.round((current / startingValue) * 100) + '%)';
    else
      text += starting.ambiguous ? ' / 시작 확인 필요' : hasStartingField ? ' / 시작 미입력' : ' / 시작 항목 없음';
    if (!hideMaximum && sanity.item.max !== null) text += ' / 최대 ' + sanity.item.max;
    return text;
  }

  function fieldValueText(characterId, item, raw, hideSanityMaximum) {
    if (item.kind === 'toggle') {
      var enabled = trim(item.onValue) ? trim(raw) === trim(item.onValue) : toggleValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var current = numericFieldValue(characterId, raw);
    if (current === null) return trim(raw);
    var sanityText = sanityValueText(characterId, item, current, hideSanityMaximum);
    if (sanityText) return sanityText;
    return item.max !== null && item.max > 0
      ? current + ' / ' + item.max + ' (' + Math.round((current / item.max) * 100) + '%)'
      : String(current);
  }

  function resourceRawValue(characterId, item) {
    if (!item) return undefined;
    if (item.attribute) return item.attribute.get('current');
    var current = getAttr(characterId, item.name);
    return current === undefined || current === null ? item.value : current;
  }

  function resourceChangeContent(character, item, before, current, detail) {
    var beforeText = fieldValueText(character.id, item, before, true);
    var currentText = fieldValueText(character.id, item, current, true);
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = !delta || item.kind === 'toggle' ? ''
      : ' <span style="color:#aaa">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var detailText = detail ? '<br><span style="color:#aaa">' + escapeHtml(detail) + '</span>' : '';
    return '<span style="font-size:10px;line-height:1.35;color:#969696"><b>' + escapeHtml(character.get('name')) + ' / ' + escapeHtml(item.label) +
      '</b> <span style="color:#b8b8b8">' + escapeHtml(beforeText) + '</span> → <b>' + escapeHtml(currentText) +
      '</b>' + deltaText + detailText + '</span>';
  }

  function sendTrackedChange(character, item, before, current, detail) {
    if (item.kind === 'toggle' &&
      fieldValueText(character.id, item, before) === fieldValueText(character.id, item, current)) return false;
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
    if (!settings.trackGmOnly && !hasPlayerController(character)) return false;
    var content = resourceChangeContent(character, item, before, current, detail);
    sendChat(settings.trackingMode === 'gm' ? '시트 헬퍼' : '',
      settings.trackingMode === 'gm' ? '/w gm ' + content : '/desc ' + content, null);
    return true;
  }

  function suppressKey(characterId, name) {
    return characterId + '|' + name;
  }

  function setResourceValue(characterId, item, value) {
    var text = String(value);
    var attribute = item.attribute;
    if (attribute && String(attribute.get('current') == null ? '' : attribute.get('current')) === text)
      return { attribute: attribute, changed: false };
    var key = suppressKey(characterId, item.name);
    var marker = { value: text };
    suppressedAttributeChanges[key] = marker;
    setTimeout(function () {
      if (suppressedAttributeChanges[key] === marker) delete suppressedAttributeChanges[key];
    }, 5000);
    if (!attribute) {
      var initial = getAttr(characterId, item.name);
      attribute = createObj('attribute', {
        characterid: characterId,
        name: item.name,
        current: String(initial == null ? '' : initial),
      });
    }
    if (!attribute) return { attribute: null, changed: false, error: '시트 수치를 저장하지 못했습니다.' };
    if (typeof attribute.setWithWorker === 'function') attribute.setWithWorker({ current: text });
    else attribute.set('current', text);
    return { attribute: attribute, changed: true };
  }

  function trackedRawValue(characterId, item) {
    return item && item.attribute
      ? item.attribute.get('current')
      : getAttr(characterId, item && item.name);
  }

  function trackedToggleEnabled(characterId, item) {
    if (!item) return false;
    var raw = trim(trackedRawValue(characterId, item));
    return trim(item.onValue) ? raw === trim(item.onValue) : toggleValue(raw) === true;
  }

  function activateTrackedToggle(character, item, detail, notifyChange) {
    if (!item || trackedToggleEnabled(character.id, item)) return false;
    var before = trackedRawValue(character.id, item);
    var next = trim(item.onValue) || '1';
    var saved = setResourceValue(character.id, item, next);
    if (!saved.changed) return false;
    item.attribute = saved.attribute;
    if (notifyChange !== false) sendTrackedChange(character, item, before, next, detail || '자동 활성화');
    return true;
  }

  function detectedRoleProblem(character, label, detected) {
    var suffix = detected && detected.ambiguous
      ? '같은 뜻의 항목이 여러 개입니다: ' + detected.matches.map(function (item) { return item.label; }).join(', ')
      : '해당 항목을 시트에서 찾지 못했습니다.';
    whisperGm('<b>' + escapeHtml(character.get('name')) + '</b> / ' + escapeHtml(label) + ' 자동 처리 생략: ' + escapeHtml(suffix));
    return label + ' 자동 처리 생략';
  }

  function successfulOutcome(result) {
    return result && ['critical', 'extreme', 'hard', 'success'].indexOf(result.outcome) > -1;
  }

  function finishAutomaticInsanity(payload, result, automation) {
    if (!successfulOutcome(result) || !automation || !automation.temporaryName) return;
    var character = getObj('character', payload.characterId);
    if (!character) return;
    var data = scan(character.id);
    if (automation.sourceHash && !sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return automation.sourceHash === candidate.contract.sourceHash;
    })) return;
    var longItem = automation.longName && data.trackedFields[automation.longName];
    if (longItem && trackedToggleEnabled(character.id, longItem)) return;
    var temporary = data.trackedFields[automation.temporaryName];
    if (!temporary || temporary.kind !== 'toggle') return;
    if (activateTrackedToggle(character, temporary, '지능 판정 성공으로 자동 활성화')) {
      invalidate(character.id);
      scheduleManager();
    }
  }

  function applyDetectedRules(character, changedItem, before, current, scannedData) {
    var data = scannedData || scan(character.id);
    var details = [];
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    if (beforeNumber === null || currentNumber === null || currentNumber >= beforeNumber) return details;

    var health = detectedFieldRole(data, 'health', 'number');
    var healthItem = health.item || health.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedHealth = healthItem && healthItem.name === changedItem.name;
    if (changedHealth) {
      var maximum = healthItem.max;
      var canCheckMajorDamage = maximum !== null && maximum > 0;
      if (!canCheckMajorDamage)
        details.push(detectedRoleProblem(character, '최대 체력', { ambiguous: false, matches: [] }));
      var major = detectedFieldRole(data, 'majorWound', 'toggle');
      var majorActive = major.item && trackedToggleEnabled(character.id, major.item);
      if (canCheckMajorDamage && beforeNumber - currentNumber >= maximum / 2 && !majorActive) {
        if (!major.item) details.push(detectedRoleProblem(character, '중상', major));
        else if (activateTrackedToggle(character, major.item, '최대 체력의 절반 이상 피해', false)) {
          majorActive = true;
          details.push('중상 활성화');
        }
      }
      if (currentNumber <= 0 && majorActive) {
        var dying = detectedFieldRole(data, 'dying', 'toggle');
        if (!dying.item) details.push(detectedRoleProblem(character, '빈사', dying));
        else if (activateTrackedToggle(character, dying.item, '체력 0 및 중상 상태', false)) details.push('빈사 활성화');
      }
      if (details.length) {
        invalidate(character.id);
        scheduleManager();
      }
      return details;
    }

    var sanity = detectedFieldRole(data, 'sanity', 'number');
    var sanityItem = sanity.item || sanity.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedSanity = sanityItem && sanityItem.name === changedItem.name;
    if (!changedSanity) return details;
    var longInsanity = detectedFieldRole(data, 'longInsanity', 'toggle');
    if (longInsanity.ambiguous) {
      details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      return details;
    }
    var longActive = longInsanity.item && trackedToggleEnabled(character.id, longInsanity.item);
    var startingSanity = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = startingSanity.item &&
      numericFieldValue(character.id, resourceRawValue(character.id, startingSanity.item));
    var longTriggered = !longActive && startingValue !== null && startingValue > 0 &&
      startingValue - currentNumber >= startingValue / 5;
    if (longTriggered) {
      if (!longInsanity.item) details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      else if (activateTrackedToggle(character, longInsanity.item, '시작 이성의 5분의 1 이상 손실', false)) {
        details.push('장기적 광기 활성화');
        invalidate(character.id);
        scheduleManager();
      }
      longActive = true;
    }
    if (beforeNumber - currentNumber < 5) return details;
    if (longActive) return details;
    var intelligence = detectedRollRole(data, 'intelligence');
    if (!intelligence.item) {
      details.push(detectedRoleProblem(character, '지능 판정', intelligence));
      return details;
    }
    var temporary = detectedFieldRole(data, 'temporaryInsanity', 'toggle');
    if (!temporary.item) {
      details.push(detectedRoleProblem(character, '일시적 광기', temporary));
    }
    var rolled = executeContractInstance(character, intelligence.item, '', false);
    if (!rolled || !rolled.ok) {
      details.push('지능 판정을 실행하지 못함');
      return details;
    }
    if (rolled.payload && rolled.payload.resultTracking !== false) {
      rolled.payload._automaticInsanity = {
        sourceHash: rolled.payload.sourceHash || '',
        longName: longInsanity.item ? longInsanity.item.name : '',
        temporaryName: temporary.item ? temporary.item.name : '',
      };
      details.push('지능 판정 자동 실행');
    } else details.push('지능 판정은 실행했지만 결과를 자동 인식할 수 없음');
    return details;
  }

  function applyResourceChange(character, query, operator, expression) {
    var data = scan(character.id);
    var resolved = resolveResource(data, query);
    if (!resolved.ok) return resolved;
    var amount = rollAmount(expression);
    if (!amount.ok) return { ok: false, error: '변경값은 +2, -1d3, =50 형식으로 입력해 주세요.' };
    var item = resolved.item;
    var current = numericFieldValue(character.id, resourceRawValue(character.id, item));
    if (current === null) return { ok: false, error: item.label + ' 값이 숫자가 아닙니다.' };
    var next = operator === '+' ? current + amount.value : operator === '-' ? current - amount.value : amount.value;
    next = Math.round(next * 1000000) / 1000000;
    var saved = setResourceValue(character.id, item, next);
    if (saved.error) return { ok: false, error: saved.error };
    if (!saved.changed) return { ok: true, value: next, unchanged: true };
    item.attribute = saved.attribute;
    var details = amount.detail !== String(amount.value) ? [amount.detail] : [];
    details = details.concat(applyDetectedRules(character, item, current, next, data));
    sendTrackedChange(character, item, current, next, details.join(' / '));
    invalidate(character.id);
    scheduleManager();
    return { ok: true, value: next };
  }

  function handleGeneralChange(msg) {
    var content = trim(msg.content);
    if (content.charAt(0) !== ':') return false;
    var match = content.match(/^:\s*(.+?)\s*([+\-=])\s*(\d*d\d+|\d+(?:\.\d+)?)\s*$/i);
    if (!match) {
      whisper(msg, '수치 변경은 <code>:체력+3</code>, <code>:이성-1d3</code>, <code>:마력=10</code>처럼 입력해 주세요.');
      return true;
    }
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok) {
      reportResult(msg, resolved);
      return true;
    }
    reportResult(msg, applyResourceChange(resolved.character, match[1], match[2], match[3]));
    return true;
  }

 function bangBangChoiceHtml(choices) {
    var labels = { check: '판정', weapon: '무기', spell: '주문', armor: '방어구' };
    return '<b>어느 항목을 실행할까요?</b><br>' + choices.map(function (choice) {
      if (choice.kind === 'contract') {
        var contractCommand = '!시트 굴림선택|' + encodeURIComponent(choice.characterId) + '|' +
          encodeURIComponent(choice.contractId) + '|' + encodeURIComponent(choice.rollKey) + '|' +
          encodeURIComponent(choice.rowId || '') + '|' + encodeURIComponent(choice.modeId || '') + '|' +
          (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.expression || '');
        return button(choice.label || choice.rollKey, contractCommand, '#111');
      }
      var command = '!시트 선택|' + encodeURIComponent(choice.characterId) + '|' + choice.kind + '|' +
        encodeURIComponent(choice.key) + '|' + (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.mode || '');
      return button((choice.label || choice.key) + ' / ' + (labels[choice.kind] || choice.kind), command, '#111');
    }).join(' ');
  }

  function decodeCommandPart(value) {
    try {
      return { ok: true, value: decodeURIComponent(String(value == null ? '' : value)) };
    } catch (err) {
      return { ok: false, error: '선택 버튼 값이 올바르지 않습니다. 항목 이름을 다시 입력해 주세요.' };
    }
  }

  function handleLegacyAliasRoll(msg, body) {
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok || !usableContractInspection(inspectContracts(resolved.character.id))) return false;
    var contracted = resolveContractAction(resolved.character, body, false, { exactOnly: true });
    if (!contracted.handled) return false;
    reportResult(msg, contracted.result);
    return true;
  }

 function handleBangBang(msg, content) {
    var body = trim(content.substring(2));
    if (!body) {
      whisper(msg, helpHtml());
      return true;
    }
    if (safeRollExpression(body)) {
      var expressionCharacter = resolveCharacter(msg, '');
      if (expressionCharacter.ok) {
        var expressionContract = resolveContractAction(expressionCharacter.character, body, false, { exactOnly: true });
        if (expressionContract.handled) {
          reportResult(msg, expressionContract.result);
          return true;
        }
      }
      return false;
    }

    if (handleLegacyAliasRoll(msg, body)) return true;

    var search = body.match(/^검색(?:\s+(.+))?$/i);
    if (search) {
      if (!trim(search[1])) return reportResult(msg, { ok: false, error: '찾을 이름을 적어 주세요. 입력 예: !!검색 관찰' });
      handleNamespaced(msg, '!시트 검색|' + trim(search[1]));
      return true;
    }

    var tracking = body.match(/^(변화알림|추적)\s+(공개|public|show|GM|비공개|hide|끄기|해제|off)$/i);
    if (tracking) {
      handleNamespaced(msg, '!시트 변화알림|' + tracking[2]);
      return true;
    }
    var gmTracking = body.match(/^(GM캐릭터알림|GM전용추적)\s+(켜기|on|표시|show|끄기|해제|off|숨김|hide)$/i);
    if (gmTracking) {
      handleNamespaced(msg, '!시트 GM캐릭터알림|' + gmTracking[2]);
      return true;
    }

    var direct = body.match(/^(도움말|help|관리|새로고침|상태|목록|점검)$/i);
    if (direct) {
      handleNamespaced(msg, '!시트 ' + direct[1]);
      return true;
    }
    var managed = body.match(/^(화자|캐릭터|전환)\s+(.+)$/i);
    if (managed) {
      handleNamespaced(msg, '!시트 ' + managed[1] + '|' + trim(managed[2]));
      return true;
    }

    var secret = false;
    var secretMatch = body.match(/^비밀\s+(.+)$/);
    if (secretMatch) {
      secret = true;
      body = trim(secretMatch[1]);
    }

    var original = body.match(/^원본\s+(.+)$/);
    if (original) body = trim(original[1]);

    var freeExpression = body.match(/^r(?:\s+(.+))?$/i);
    if (freeExpression) {
      if (!trim(freeExpression[1]))
        return reportResult(msg, { ok: false, error: '자유 주사위 식을 적어 주세요. 입력 예: !!r 2d6+3' });
      return withCharacter(msg, '', function (character) {
        var contracted = executeContractExpression(character, freeExpression[1], secret);
        return contracted || { ok: false, error: SHEET_NOT_RECOGNIZED };
      });
    }

    return withCharacter(msg, '', function (character) {
      var contracted = resolveContractAction(character, body, secret);
      if (!contracted.handled) {
        var categorized = body.match(/^(?:판정|무기|주문|방어구)\s+(.+)$/);
        if (categorized) contracted = resolveContractAction(character, trim(categorized[1]), secret);
      }
      if (contracted.handled) return contracted.result;
      if (contracted.inspection && !usableContractInspection(contracted.inspection) && contracted.inspection.status === 'ambiguous')
        return { ok: false, error: contracted.inspection.error };
      return {
        ok: false,
        error: contracted.inspection && usableContractInspection(contracted.inspection)
          ? '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.'
          : SHEET_NOT_RECOGNIZED,
      };
    });
  }

  function handleNamespaced(msg, content) {
    var parts = content.substring(3).split('|').map(trim);
    var action = normalize(parts.shift() || '도움말');
    if (action === '추적') action = '변화알림';
    else if (action === 'gm전용추적') action = 'gm캐릭터알림';
    if (action === '도움말' || action === 'help') return whisper(msg, helpHtml());
    if (action === '검색')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, searchHtml(checked.data, parts[0]));
        return { ok: true };
      });
    if (action === '점검') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var inspected = resolveInspectionCharacter(msg);
      if (!inspected.ok) return reportResult(msg, inspected);
      return reportResult(msg, (function (character) {
        var recognition = inspectContracts(character.id);
        if (!usableContractInspection(recognition))
          return { ok: false, error: recognition.error || SHEET_NOT_RECOGNIZED };
        whisper(msg, inspectionHtml(scan(character.id, true)));
        return { ok: true };
      })(inspected.character));
    }
    if (action === '굴림목록' || action === '계약목록') {
      var listCharacter = decodeCommandPart(parts[0]);
      var listLabel = decodeCommandPart(parts[1]);
      if (!listCharacter.ok || !listLabel.ok)
        return reportResult(msg, !listCharacter.ok ? listCharacter : listLabel);
      return withCharacter(msg, listCharacter.value, function (character) {
        var inspection = inspectContracts(character.id);
        if (!usableContractInspection(inspection))
          return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
        var matches = preferredContractRolls(scan(character.id)).filter(function (instance) {
          return normalize(instance.label) === normalize(listLabel.value);
        }).map(function (instance) {
          instance.characterId = character.id;
          return { instance: instance };
        });
        if (!matches.length) return { ok: false, error: '선택한 굴림이 바뀌었습니다. 관리 화면을 다시 열어 주세요.' };
        if (matches.length === 1) return executeContractInstance(character, matches[0].instance, '', parts[2] === '1');
        return contractConflict(matches, parts[2] === '1');
      });
    }
    if (action === '굴림선택' || action === '계약선택') {
      var contractCharacter = decodeCommandPart(parts[0]);
      var contractId = decodeCommandPart(parts[1]);
      var contractRollKey = decodeCommandPart(parts[2]);
      var contractRowId = decodeCommandPart(parts[3]);
      var contractModeId = decodeCommandPart(parts[4]);
      var contractExpression = decodeCommandPart(parts[6]);
      var invalidContractPart = [contractCharacter, contractId, contractRollKey, contractRowId, contractModeId, contractExpression]
        .filter(function (part) { return !part.ok; })[0];
      if (invalidContractPart) return reportResult(msg, invalidContractPart);
      if (!contractCharacter.value || !contractId.value || !contractRollKey.value)
        return reportResult(msg, { ok: false, error: '선택한 굴림 정보가 비어 있습니다. 항목을 다시 선택해 주세요.' });
      return withCharacter(msg, contractCharacter.value, function (character) {
        return executeContract(
          character.id,
          contractId.value,
          contractRollKey.value,
          contractRowId.value,
          contractModeId.value,
          parts[5] === '1',
          contractExpression.value,
        );
      });
    }
    if (action === '변화알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var trackingMode = normalize(parts[0]);
      if (/^(?:공개|public|show)$/.test(trackingMode)) initState().trackingMode = 'public';
      else if (/^(?:gm|비공개|hide)$/.test(trackingMode)) initState().trackingMode = 'gm';
      else if (/^(?:끄기|해제|off)$/.test(trackingMode)) initState().trackingMode = 'off';
      else return whisperGm('변화 알림은 공개, GM, 끄기 중 하나를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('수치 변화 알림: <b>' + (initState().trackingMode === 'public' ? '전체 공개' : initState().trackingMode === 'gm' ? 'GM만' : '끄기') + '</b>');
    }
    if (action === 'gm캐릭터알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var gmTracking = normalize(parts[0]);
      if (/^(?:켜기|on|표시|show)$/.test(gmTracking)) initState().trackGmOnly = true;
      else if (/^(?:끄기|해제|off|숨김|hide)$/.test(gmTracking)) initState().trackGmOnly = false;
      else return whisperGm('GM 전용 캐릭터 알림은 켜기 또는 끄기를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('플레이어 권한이 없는 GM 캐릭터 변화 알림: <b>' + (initState().trackGmOnly ? '켜기' : '끄기') + '</b>');
    }
    if (action === '관리') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      return whisperGm(openManager());
    }
    if (action === '새로고침') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      invalidate();
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 항목을 다시 읽었습니다.');
    }
    if (action === '화자' || action === '캐릭터' || action === '전환')
      return switchSpeaker(msg, parts[0]);
    if (action === '현황보기' || action === '관리대상') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      if (!getObj('character', parts[0])) return whisperGm('캐릭터를 찾지 못했습니다.');
      initState().managerCharacterId = parts[0];
      initState().managerHash = '';
      managerHandout();
      return;
    }
    if (action === '상태' || action === '목록')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, statusHtml(checked.data));
        return { ok: true };
      });
    if (action === '판정' || action === '비밀판정')
      return withCharacter(msg, '', function (character) {
        return rollCheck(character.id, parts[0], { secret: action === '비밀판정', mode: parts[1] });
      });
    if (action === '무기' || action === '비밀무기')
      return withCharacter(msg, '', function (character) { return rollWeapon(character.id, parts[0], action === '비밀무기'); });
    if (action === '주문' || action === '비밀주문')
      return withCharacter(msg, '', function (character) { return showSpell(character.id, parts[0], action === '비밀주문'); });
    if (action === '방어구' || action === '비밀방어구')
      return withCharacter(msg, '', function (character) { return rollArmor(character.id, parts[0], action === '비밀방어구'); });
    return whisper(msg, '알 수 없는 시트 명령입니다.<br>' + helpHtml());
  }

  function handleLegacy(msg, content) {
    if (content.indexOf('!!') === 0) return handleBangBang(msg, content);
    if (content === '!s' || /^!s\s+/.test(content)) {
      var secretTarget = trim(content.substring(2));
      if (/^[\d(]/.test(secretTarget)) return false;
      withCharacter(msg, '', function (character) { return rollCheck(character.id, secretTarget, { secret: true }); });
      return true;
    }
    var match = content.match(/^!(?:atk|무기)\s+(.+)$/i);
    if (match) {
      withCharacter(msg, '', function (character) { return rollWeapon(character.id, match[1], false); });
      return true;
    }
    if (/^!(?:status|skills|기능|weapons)$/.test(content)) {
      withCharacter(msg, '', function (character) {
        whisper(msg, statusHtml(scan(character.id)));
        return { ok: true };
      });
      return true;
    }
    return false;
  }

  function contractRelevant(name) {
    var wanted = trim(name);
    if (!wanted) return false;
    var catalog = recognitionCatalog(sheetContracts());
    return !!catalog.exact[wanted] || triePrefixes(catalog.prefixes, wanted).length > 0;
  }

  function trackAttributeChange(attribute, previous, scannedData) {
    if (!attribute || !previous) return;
    var characterId = attribute.get('_characterid');
    var name = trim(attribute.get('name'));
    var current = String(attribute.get('current') == null ? '' : attribute.get('current'));
    var before = String(previous.current == null ? '' : previous.current);
    if (!characterId || before === current) return;
    var key = suppressKey(characterId, name);
    if (suppressedAttributeChanges[key]) {
      if (suppressedAttributeChanges[key].value === current) {
        delete suppressedAttributeChanges[key];
        return;
      }
      delete suppressedAttributeChanges[key];
    }
    if (!contractRelevant(name)) return;
    var data = scannedData || scan(characterId);
    var item = data.trackedFields && data.trackedFields[name];
    if (!item) return;
    item = data.resourcesByAttribute && data.resourcesByAttribute[name] || item;
    var character = getObj('character', characterId);
    if (!character) return;
    var details = applyDetectedRules(character, item, before, current, data);
    sendTrackedChange(character, item, before, current, details.join(' / '));
  }

  function cachedUntrackedToggle(characterId, name) {
    var data = cache[characterId];
    var candidates = data && sourceCandidateInspections(data.contractMatch);
    if (!candidates || !candidates.length || data.trackedFields && data.trackedFields[name]) return false;
    return candidates.every(function (candidate) {
      var field = contractRuntimeIndex(candidate.contract).fieldGlobal[name];
      return !!(field && /^(?:checkbox|radio)$/i.test(trim(field.type)));
    });
  }

  function flushAttributeChanges() {
    attributeChangeTimer = null;
    var changes = pendingAttributeOrder.map(function (key) { return pendingAttributeChanges[key]; });
    pendingAttributeChanges = {};
    pendingAttributeOrder = [];
    if (!changes.length) return;

    var allMembershipChanged = changes.some(function (change) { return change.membershipChanged; });
    var affected = {};
    changes.forEach(function (change) { affected[change.characterId] = true; });
    if (allMembershipChanged) invalidate();
    else Object.keys(affected).forEach(function (characterId) { invalidate(characterId); });

    var scanned = {};
    changes.forEach(function (change) {
      if (!change.previous || change.presentationOnly ||
        change.membershipChanged && change.previous.current === undefined) return;
      var data = scanned[change.characterId];
      if (!data) data = scanned[change.characterId] = scan(change.characterId);
      if (!data.ok || cachedUntrackedToggle(change.characterId, change.name)) return;
      trackAttributeChange(change.attribute, change.previous, data);
    });
    scheduleManager();
  }

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !contractRelevant(name))) return;
    var key = characterId + '|' + name;
    var pending = pendingAttributeChanges[key];
    var presentationOnly = !membershipChanged && cachedUntrackedToggle(characterId, name);
    invalidate(characterId);
    if (!pending) {
      pending = pendingAttributeChanges[key] = {
        attribute: attribute,
        previous: previous,
        membershipChanged: membershipChanged,
        presentationOnly: presentationOnly,
        characterId: characterId,
        name: name,
      };
      pendingAttributeOrder.push(key);
    } else {
      pending.attribute = attribute;
      if (!pending.previous && previous) pending.previous = previous;
      pending.membershipChanged = pending.membershipChanged || membershipChanged;
      pending.presentationOnly = pending.presentationOnly && presentationOnly;
    }
    if (attributeChangeTimer) clearTimeout(attributeChangeTimer);
    attributeChangeTimer = setTimeout(flushAttributeChanges, 25);
  }

  api.version = VERSION;
  api.scan = scan;
  api.roll = rollCheck;
  api.rollWeapon = rollWeapon;
  api.showSpell = showSpell;
  api.rollArmor = rollArmor;
  api.rollFree = rollFree;
  api.cutinItems = cutinItems;
  api.outcomes = OUTCOMES;
  api.registerContract = registerContract;
  api.sheetContracts = sheetContracts;
  api.inspectContracts = function (characterId) {
    return inspectContracts(characterId);
  };
  api.contractRolls = function (characterId) {
    return commonContractRolls(characterId, inspectContracts(characterId), false);
  };
  api.exactContractInstance = exactContractInstance;
  api.qualifyContractMacro = qualifyContractMacro;
  api.executeContract = executeContract;
  api.resolveContractAction = resolveContractAction;
  api.refresh = function () {
    invalidate();
    initState().managerHash = '';
    initState().playerHelpHash = '';
    var manager = managerHandout();
    playerHelpHandout();
    return manager;
  };

  function registerAdapter() {
    var adapter = {
      meta: { code: '10_sheet_helper.js', title: '시트 헬퍼' },
      aliases: { 시트: '', sheet: '' },
      status: function () {
        return { sheets: sheetContracts().length };
      },
      cutinItems: cutinItems,
      outcomes: function () { return OUTCOMES; },
      refresh: api.refresh,
      help: [
        '<code>!!도움말</code> PL용과 GM용 명령어 확인',
        '<code>!!굴릴항목이름</code> 현재 시트의 굴림 실행',
        '<code>!!비밀 굴릴항목이름</code> 현재 시트의 굴림을 GM에게 실행',
        '<code>!!검색 이름</code> 항목과 현재 수치 검색',
        '<code>!!상태</code> PL용 현재 시트의 항목과 수치 확인',
        '<code>:수치이름+3</code> 내 캐릭터 수치 변경',
        '<code>!!점검</code> GM용 시트 인식 점검',
        '<code>!!화자 이름</code> GM용 채팅 화자 전환',
        '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀',
        '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위 설정',
        '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함',
        '<code>!!관리</code> GM용 인식 항목 관리',
      ],
    };
    if (typeof KIBScene.register === 'function') KIBScene.register('sheet', adapter);
    else {
      KIBScene.adapters = KIBScene.adapters || {};
      KIBScene.adapters.sheet = adapter;
    }
  }

  on('ready', function () {
    if (!sheet_helper_setting.enabled) return;
    initState();
    registerAdapter();
    if (typeof KIBScene.refreshHandout === 'function') KIBScene.refreshHandout();
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    if (cutin && typeof cutin.refreshSheetControls === 'function')
      cutin.refreshSheetControls();
    scheduleManager();
  });

  on('chat:message', function (msg) {
    if (!sheet_helper_setting.enabled || !msg) return;
    try {
      if (msg.type !== 'api' && captureResult(msg)) return;
      var content = trim(msg.content);
      if (!content) return;
      if (msg.type === 'general' && handleGeneralChange(msg)) return;
      if (msg.type === 'api') {
        if (/^!시트(?:$|\s|\|)/.test(content)) return handleNamespaced(msg, content);
        if (sheet_helper_setting.legacy_commands) handleLegacy(msg, content);
      }
    } catch (err) {
      whisperGm('시트 헬퍼 오류: ' + escapeHtml(err && err.message ? err.message : err));
    }
  });

  on('add:character', function (character) {
    invalidate();
    scheduleManager();
  });
  on('destroy:character', function (character) {
    invalidate();
    if (initState().managerCharacterId === character.id) initState().managerCharacterId = '';
    scheduleManager();
  });
  on('add:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('change:attribute', function (attribute, previous) {
    onAttributeChanged(attribute, previous || null);
  });
  on('destroy:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('destroy:handout', function (handout) {
    if (initState().managerId === handout.id) {
      initState().managerId = '';
      initState().managerHash = '';
    }
    if (initState().playerHelpId === handout.id) {
      initState().playerHelpId = '';
      initState().playerHelpHash = '';
    }
  });
})(KIBSheetHelper);
